import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { router } from "expo-router";
import { COLORS, TEST_TYPE_LABELS } from "../../lib/constants";
import { useTestHistory } from "../../context/ScanHistoryContext";
import { BiomarkerTrendChart } from "../../components/charts/BiomarkerTrendChart";
import { Ionicons } from "@expo/vector-icons";
import { TestResult } from "../../types";

function getAlertText(test: TestResult | null): string {
  if (!test)
    return "No test results yet. Use the scan button below to run your first test.";
  const flagged = test.biomarkers.filter((b) => b.level !== "normal");
  if (flagged.length === 0)
    return "All markers from your latest test are within normal range. Keep it up!";
  const names = flagged.map((b) => b.displayName).join(", ");
  const action =
    "Make sure you're drinking enough water and eating a balanced diet.";
  return `Your latest ${TEST_TYPE_LABELS[test.testType]} test flagged: ${names}. ${action}`;
}

const TEST_INTERVAL_DAYS = 7;

function getNextTestInfo(tests: TestResult[]): { daysUntil: number } | null {
  if (tests.length === 0) return null;
  const lastDate = new Date(tests[0].date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  lastDate.setHours(0, 0, 0, 0);
  const daysSince = Math.floor(
    (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
  );
  return { daysUntil: Math.max(0, TEST_INTERVAL_DAYS - daysSince) };
}

export default function HomeScreen() {
  const { tests } = useTestHistory();
  const latestTest = tests[0] ?? null;
  const alertText = getAlertText(latestTest);
  const tabBarHeight = useBottomTabBarHeight();
  const nextTest = getNextTestInfo(tests);
  const [nextTestModalVisible, setNextTestModalVisible] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: tabBarHeight + 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View
          style={{
            paddingTop: 20,
            paddingBottom: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View>
            <Text
              style={{ fontSize: 28, fontWeight: "800", color: COLORS.primary }}
            >
              LactiKit
            </Text>
            <Text style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>
              Baby & Maternal Health Tracker
            </Text>
          </View>
          {nextTest && (
            <TouchableOpacity
              onPress={() => setNextTestModalVisible(true)}
              activeOpacity={0.75}
              style={{
                backgroundColor: COLORS.primary + "18",
                borderRadius: 12,
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderWidth: 1,
                borderColor: COLORS.primary + "40",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: "600",
                  color: COLORS.primary,
                }}
              >
                Next test in
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "800",
                  color: COLORS.primary,
                  lineHeight: 20,
                }}
              >
                {nextTest.daysUntil}d
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Next Test Modal */}
        <Modal
          visible={nextTestModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setNextTestModalVisible(false)}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: "#00000044",
              justifyContent: "center",
              alignItems: "center",
            }}
            activeOpacity={1}
            onPress={() => setNextTestModalVisible(false)}
          >
            <TouchableOpacity activeOpacity={1} onPress={() => {}}>
              <View
                style={{
                  backgroundColor: COLORS.surface,
                  borderRadius: 20,
                  padding: 28,
                  marginHorizontal: 32,
                  alignItems: "center",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.12,
                  shadowRadius: 24,
                  elevation: 8,
                  borderWidth: 1,
                  borderColor: COLORS.border,
                }}
              >
                <View
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 26,
                    backgroundColor: COLORS.primary + "18",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                  }}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={26}
                    color={COLORS.primary}
                  />
                </View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: "#111827",
                    marginBottom: 8,
                    textAlign: "center",
                  }}
                >
                  Upcoming Test
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "#6B7280",
                    textAlign: "center",
                    lineHeight: 22,
                  }}
                >
                  You should take your next tests in{"\n"}
                  <Text style={{ fontWeight: "700", color: COLORS.primary }}>
                    {nextTest.daysUntil === 0
                      ? "today"
                      : `${nextTest.daysUntil} day${nextTest.daysUntil === 1 ? "" : "s"}`}
                  </Text>
                  {nextTest.daysUntil > 0 ? "." : " — it's time to scan!"}
                </Text>
                <TouchableOpacity
                  onPress={() => setNextTestModalVisible(false)}
                  style={{
                    marginTop: 20,
                    backgroundColor: COLORS.primary,
                    borderRadius: 12,
                    paddingHorizontal: 28,
                    paddingVertical: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "700",
                      color: "#FFFFFF",
                    }}
                  >
                    Got it
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>

        {/* Alert / Advice Card */}
        <View
          style={{
            backgroundColor: COLORS.surface,
            borderRadius: 16,
            padding: 16,
            marginBottom: 20,
            borderWidth: 1,
            borderColor:
              (latestTest &&
              latestTest.biomarkers.some((b) => b.level !== "normal")
                ? COLORS.warning
                : "#0D9488") + "40",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <Ionicons
              name="alert-circle-outline"
              size={18}
              color={COLORS.warning}
              style={{ marginRight: 6 }}
            />
            <Text
              style={{
                fontSize: 13,
                fontWeight: "700",
                color: "#111827",
                flex: 1,
              }}
            >
              Health Advice
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/health-advice")}
              activeOpacity={0.75}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  color: COLORS.primary,
                }}
              >
                Show More
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={{ fontSize: 13, color: "#374151", lineHeight: 20 }}>
            {alertText}
          </Text>
        </View>

        {/* Biomarker Trends */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 14,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "600",
              color: "#6B7280",
              textTransform: "uppercase",
              letterSpacing: 0.8,
            }}
          >
            Biomarker Trends
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/all-trends")}
            activeOpacity={0.75}
          >
            <Text
              style={{ fontSize: 12, fontWeight: "600", color: COLORS.primary }}
            >
              Show All →
            </Text>
          </TouchableOpacity>
        </View>

        {/* Vitamin C Trend */}
        <View
          style={{
            backgroundColor: COLORS.surface,
            borderRadius: 16,
            padding: 16,
            marginBottom: 14,
            borderWidth: 1,
            borderColor: COLORS.border,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <BiomarkerTrendChart
            biomarkerName="vitamin_c"
            displayName="Vitamin C"
            unit="mg/dL"
            tests={tests}
            chartType="line"
          />
        </View>

        {/* Protein Trend */}
        <View
          style={{
            backgroundColor: COLORS.surface,
            borderRadius: 16,
            padding: 16,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: COLORS.border,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <BiomarkerTrendChart
            biomarkerName="protein"
            displayName="Protein"
            unit="mg/dL"
            tests={tests}
            chartType="line"
          />
        </View>

        {/* Past Tests */}
        <Text
          style={{
            fontSize: 15,
            fontWeight: "700",
            color: "#111827",
            marginBottom: 14,
          }}
        >
          Past Tests
        </Text>
        {tests.length === 0 ? (
          <View
            style={{
              borderWidth: 1.5,
              borderColor: COLORS.border,
              borderStyle: "dashed",
              borderRadius: 16,
              padding: 24,
              alignItems: "center",
              marginBottom: 24,
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: "600",
                color: "#6B7280",
                marginBottom: 4,
              }}
            >
              No tests yet
            </Text>
            <Text
              style={{ fontSize: 12, color: "#9CA3AF", textAlign: "center" }}
            >
              Tap the scan button below to run your first test
            </Text>
          </View>
        ) : (
          tests.map((test) => {
            const flagged = test.biomarkers.filter((b) => b.level !== "normal");
            const date = new Date(test.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });
            return (
              <TouchableOpacity
                key={test.id}
                activeOpacity={0.8}
                onPress={() =>
                  router.push({
                    pathname: "/test/[id]",
                    params: { id: test.id },
                  })
                }
                style={{
                  backgroundColor: COLORS.surface,
                  borderRadius: 14,
                  padding: 14,
                  marginBottom: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: COLORS.border,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.04,
                  shadowRadius: 4,
                  elevation: 1,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: "#111827",
                      marginBottom: 3,
                    }}
                  >
                    {TEST_TYPE_LABELS[test.testType]}
                  </Text>
                  <Text style={{ fontSize: 12, color: "#9CA3AF" }}>{date}</Text>
                </View>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  {flagged.length > 0 ? (
                    <View
                      style={{
                        backgroundColor: COLORS.warning + "22",
                        borderRadius: 9999,
                        paddingHorizontal: 8,
                        paddingVertical: 3,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 11,
                          fontWeight: "700",
                          color: COLORS.warning,
                        }}
                      >
                        {flagged.length} flagged
                      </Text>
                    </View>
                  ) : (
                    <View
                      style={{
                        backgroundColor: "#0D948822",
                        borderRadius: 9999,
                        paddingHorizontal: 8,
                        paddingVertical: 3,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 11,
                          fontWeight: "700",
                          color: "#0D9488",
                        }}
                      >
                        All normal
                      </Text>
                    </View>
                  )}
                  <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
                </View>
              </TouchableOpacity>
            );
          })
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
