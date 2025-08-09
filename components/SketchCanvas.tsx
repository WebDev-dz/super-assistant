import React, { useState, useRef } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Alert,
  Platform,
  TouchableOpacityProps,
} from "react-native";
import { BottomSheet as BottomSheetComponent, BottomSheetContent, BottomSheetOpenTrigger, useBottomSheet, } from "~/components/deprecated-ui/bottom-sheet";
import { Button } from "~/components/ui/button";
import db from "@/db";
import { id } from "@instantdb/react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import GoalsFlowModal from "./GoalFormFlow";
import GoalCard from "./cards/GoalCard";
import { z } from "zod";
import { GoalSchema } from "@/lib/validations";
import MileStonesForm from "./MileStonesForm";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";


export default function GoalsManager() {

  const bottomSheetContext = useBottomSheet()
  const { data, isLoading, error } = db.useQuery(
    {
      goals: {},
      milestones: {},
      progress: {},
    },
    {
      ruleParams: {
        goals: {
          limit: 100,
          sort: [["createdAt", "desc"]],
        },
        milestones: {
          limit: 100,
          sort: [["createdAt", "desc"]],
        },
        progress: {
          limit: 100,
          sort: [["recordedAt", "desc"]],
        },
      },
    }
  );

  const goals = React.useMemo(() => data?.goals || [], [data?.goals]);
  const milestones = React.useMemo(() => data?.milestones || [], [data?.milestones]);
  const progress = React.useMemo(() => data?.progress || [], [data?.progress]);
  const BottomSheetinsets = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Modal states
  const [selectedGoal, setSelectedGoal] = useState<z.infer<typeof GoalSchema> | null>(null);
  const [activeTab, setActiveTab] = useState<
    "all" | "not_started" | "in_progress" | "on_hold" | "completed" | "cancelled"
  >("all");

  const filteredGoals = goals.filter(
    (goal) => activeTab === "all" || goal.status === activeTab
  );

  const updateGoalStatus = (
    goalId: string,
    status: "not_started" | "in_progress" | "completed" | "on_hold" | "cancelled"
  ) => {
    try {
      db.transact(
        db.tx.goals[goalId].update({
          status,
          updatedAt: new Date().toISOString(),
        })
      );
    } catch (err) {
      console.error("Error updating goal status:", err);
      Alert.alert("Error", "Failed to update goal status.");
    }
  };

  const deleteGoal = (goalId: string) => {
    Alert.alert(
      "Delete Goal",
      "Are you sure you want to delete this goal? This will also delete all associated milestones and progress.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const goalMilestones = milestones.filter((m) => m.goalId === goalId);
              const milestoneIds = goalMilestones.map((m) => m.id);
              const relatedProgress = progress.filter((p) =>
                milestoneIds.includes(p.milestoneId)
              );

              await db.transact([
                ...relatedProgress.map((p) => db.tx.progress[p.id].delete()),
                ...goalMilestones.map((m) => db.tx.milestones[m.id].delete()),
                db.tx.goals[goalId].delete(),
              ]);
            } catch (err) {
              console.error("Error deleting goal:", err);
              Alert.alert("Error", "Failed to delete goal.");
            }
          },
        },
      ]
    );
  };

  const getGoalProgress = (goalId: string) => {
    const goalMilestones = milestones.filter((m) => m.goalId === goalId);
    if (goalMilestones.length === 0) return 0;

    const totalPercentage = goalMilestones.reduce(
      (sum: number, m) => sum + (m.completed ? m.percentage : 0),
      0
    );
    return Math.min(totalPercentage, 100);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row justify-between items-center px-5 pt-5 pb-5 bg-white border-b border-gray-200">
        <Text className="text-3xl font-bold text-gray-900">SMART Goals</Text>
        <GoalsFlowModal />
      </View>

      {/* Tabs */}
      <View className="flex-row bg-white px-5 border-b border-gray-200">
        {(["all", "not_started", "in_progress", "on_hold", "completed", "cancelled"] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            className={`flex-1 py-4 items-center ${activeTab === tab ? "border-b-2 border-indigo-500" : ""}`}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              className={`text-sm font-semibold ${activeTab === tab ? "text-indigo-500" : "text-gray-500"
                }`}
            >
              {tab === "all"
                ? "All"
                : tab.charAt(0).toUpperCase() + tab.slice(1).replace("_", " ")}{" "}
              ({goals.filter((g) => tab === "all" || g.status === tab).length})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Goals List */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg text-gray-500">Loading...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg text-red-500">Error: {error.message}</Text>
        </View>
      ) : (
        <ScrollView className="flex-1 p-5" showsVerticalScrollIndicator={false}>
          {filteredGoals.length === 0 ? (
            <View className="items-center py-15">
              <Text className="text-lg font-semibold text-gray-500 mb-2">
                No {activeTab === "all" ? "" : activeTab} goals yet
              </Text>
              <Text className="text-sm text-gray-400 text-center">
                {activeTab === "all"
                  ? "Create your first goal to get started!"
                  : `No ${activeTab.replace("_", " ")} goals to show.`}
              </Text>
            </View>
          ) : (
            filteredGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                progress={getGoalProgress(goal.id)}
                onPress={() => {
                  setSelectedGoal(goal);
                  bottomSheetRef?.current?.present()

                }}
                onEdit={() => {
                  // Implement edit logic, e.g., open GoalsFlowModal with goal data
                  console.log("Edit goal:", goal.id);
                }}
                onDelete={() => deleteGoal(goal.id)}
                onStatusChange={(status) =>
                  updateGoalStatus(goal.id, status as any)
                }
              />
            ))
          )}
        </ScrollView>
      )}

      {/* Milestones BottomSheet */}
      <BottomSheetComponent
        // @ts-ignore
        
      >
        <BottomSheetOpenTrigger asChild>
          <Button className="display-none">
            <Text>{Platform.OS === 'web' ? 'Not implemented for web yet' : 'Open'}</Text>
          </Button>
        </BottomSheetOpenTrigger>
        <BottomSheetContent ref={bottomSheetRef}  snapPoints={["50%", "80%"]} topInset={BottomSheetinsets.top + 44}>
          <View className="flex-1">
            <View className="flex-row justify-between items-center px-5 py-3 border-b border-gray-200">
              <Text className="text-lg font-semibold text-gray-900">
                {selectedGoal ? `Milestones for ${selectedGoal.title}` : "Milestones"}
              </Text>
              <TouchableOpacity
                onPress={() => bottomSheetRef.current?.close()}
              >
                <Text className="text-indigo-500">Close</Text>
              </TouchableOpacity>
            </View>
            <BottomSheetScrollView>
              {selectedGoal ? (
                <MileStonesForm goalId={selectedGoal?.id} />
              ) : (
                <Text className="text-center text-gray-500 p-5">
                  Select a goal to view or add milestones.
                </Text>
              )}
            </BottomSheetScrollView>
          </View>
        </BottomSheetContent>
      </BottomSheetComponent>
    </SafeAreaView>
  );
}