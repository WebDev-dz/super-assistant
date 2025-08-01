import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  TextInput,
  Modal,
  Dimensions,
  Alert,
} from "react-native";
import db from "@/db";
import { id } from "@instantdb/react-native";

const { width: screenWidth } = Dimensions.get("window");

interface Goal {
  id: string;
  title: string;
  description?: string;
  measurableTarget?: number;
  measurableUnit?: string;
  isAchievable: boolean;
  relevantCategory?: string;
  deadline?: number;
  createdAt: number;
  updatedAt?: number;
  status: "active" | "completed" | "archived";
}

interface Milestone {
  id: string;
  goalId: string;
  title: string;
  percentage: number;
  deadline?: number;
  createdAt: number;
  status: "pending" | "completed";
}

interface Progress {
  id: string;
  milestoneId: string;
  value: number;
  note?: string;
  recordedAt: number;
}

const CATEGORIES = [
  { name: "Health", icon: "🏃", color: "#10B981" },
  { name: "Career", icon: "💼", color: "#6366F1" },
  { name: "Education", icon: "📚", color: "#8B5CF6" },
  { name: "Finance", icon: "💰", color: "#F59E0B" },
  { name: "Personal", icon: "🌱", color: "#EC4899" },
  { name: "Relationships", icon: "👥", color: "#EF4444" },
];

const STATUS_COLORS = {
  active: "#10B981",
  completed: "#6366F1",
  archived: "#6B7280",
};

export default function GoalsManager() {
  const { data } = db.useQuery({
    goals: {},
    milestones: {},
    progress: {},
  });

  const goals = React.useMemo(() => data?.goals || [], [data?.goals]);
  const milestones = React.useMemo(() => data?.milestones || [], [data?.milestones]);
  const progress = React.useMemo(() => data?.progress || [], [data?.progress]);

  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [showMilestonesModal, setShowMilestonesModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [activeTab, setActiveTab] = useState<"active" | "completed" | "archived">("active");

  // Form states
  const [goalTitle, setGoalTitle] = useState("");
  const [goalDescription, setGoalDescription] = useState("");
  const [measurableTarget, setMeasurableTarget] = useState("");
  const [measurableUnit, setMeasurableUnit] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [deadline, setDeadline] = useState("");

  const filteredGoals = goals.filter((goal: Goal) => goal.status === activeTab);

  const createGoal = () => {
    if (!goalTitle.trim()) {
      Alert.alert("Error", "Please enter a goal title");
      return;
    }

    const goalId = id();
    const deadlineTimestamp = deadline ? new Date(deadline).getTime() : undefined;

    db.transact(
      db.tx.goals[goalId].update({
        title: goalTitle.trim(),
        description: goalDescription.trim() || undefined,
        measurableTarget: measurableTarget ? parseFloat(measurableTarget) : undefined,
        measurableUnit: measurableUnit.trim() || undefined,
        isAchievable: true,
        relevantCategory: selectedCategory.name,
        deadline: deadlineTimestamp,
        createdAt: Date.now(),
        status: "active",
      })
    );

    // Reset form
    setGoalTitle("");
    setGoalDescription("");
    setMeasurableTarget("");
    setMeasurableUnit("");
    setDeadline("");
    setShowAddGoalModal(false);
  };

  const updateGoalStatus = (goalId: string, status: "active" | "completed" | "archived") => {
    db.transact(
      db.tx.goals[goalId].update({
        status,
        updatedAt: Date.now(),
      })
    );
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
          onPress: () => {
            // Delete related milestones and progress
            const goalMilestones = milestones.filter((m: Milestone) => m.goalId === goalId);
            const milestoneIds = goalMilestones.map((m: Milestone) => m.id);
            const relatedProgress = progress.filter((p: Progress) => 
              milestoneIds.includes(p.milestoneId)
            );

            db.transact([
              ...relatedProgress.map((p: Progress) => db.tx.progress[p.id].delete()),
              ...goalMilestones.map((m: Milestone) => db.tx.milestones[m.id].delete()),
              db.tx.goals[goalId].delete(),
            ]);
          },
        },
      ]
    );
  };

  const getGoalProgress = (goalId: string) => {
    const goalMilestones = milestones.filter((m: Milestone) => m.goalId === goalId);
    if (goalMilestones.length === 0) return 0;

    const completedMilestones = goalMilestones.filter((m: Milestone) => m.status === "completed");
    const totalPercentage = completedMilestones.reduce((sum: number, m: Milestone) => sum + m.percentage, 0);
    
    return Math.min(totalPercentage, 100);
  };

  const formatDeadline = (timestamp?: number) => {
    if (!timestamp) return "No deadline";
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.ceil((timestamp - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays === 0) return "Due today";
    if (diffDays === 1) return "Due tomorrow";
    return `${diffDays} days left`;
  };

  const renderGoalCard = (goal: Goal) => {
    const category = CATEGORIES.find(c => c.name === goal.relevantCategory) || CATEGORIES[0];
    const progressPercentage = getGoalProgress(goal.id);
    const goalMilestones = milestones.filter((m: Milestone) => m.goalId === goal.id);

    return (
      <View key={goal.id} style={[styles.goalCard, { borderLeftColor: category.color }]}>
        <View style={styles.goalHeader}>
          <View style={styles.goalTitleRow}>
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text style={styles.goalTitle}>{goal.title}</Text>
            <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[goal.status] }]}>
              <Text style={styles.statusText}>{goal.status.toUpperCase()}</Text>
            </View>
          </View>
          
          {goal.description && (
            <Text style={styles.goalDescription}>{goal.description}</Text>
          )}
        </View>

        <View style={styles.goalMetrics}>
          {goal.measurableTarget && (
            <Text style={styles.metricText}>
              Target: {goal.measurableTarget} {goal.measurableUnit}
            </Text>
          )}
          <Text style={styles.metricText}>
            Category: {goal.relevantCategory}
          </Text>
          <Text style={[
            styles.metricText,
            goal.deadline && new Date(goal.deadline) < new Date() ? styles.overdue : null
          ]}>
            {formatDeadline(goal.deadline)}
          </Text>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>Progress: {progressPercentage}%</Text>
            <Text style={styles.milestonesText}>
              {goalMilestones.length} milestone{goalMilestones.length !== 1 ? 's' : ''}
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${progressPercentage}%`, backgroundColor: category.color }
              ]} 
            />
          </View>
        </View>

        <View style={styles.goalActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.milestonesButton]}
            onPress={() => {
              setSelectedGoal(goal);
              setShowMilestonesModal(true);
            }}
          >
            <Text style={styles.actionButtonText}>Milestones</Text>
          </TouchableOpacity>

          {goal.status === "active" && (
            <TouchableOpacity
              style={[styles.actionButton, styles.completeButton]}
              onPress={() => updateGoalStatus(goal.id, "completed")}
            >
              <Text style={styles.actionButtonText}>Complete</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => deleteGoal(goal.id)}
          >
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SMART Goals</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddGoalModal(true)}
        >
          <Text style={styles.addButtonText}>+ Add Goal</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {(["active", "completed", "archived"] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)} ({goals.filter((g: Goal) => g.status === tab).length})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Goals List */}
      <ScrollView style={styles.goalsList} showsVerticalScrollIndicator={false}>
        {filteredGoals.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No {activeTab} goals yet
            </Text>
            <Text style={styles.emptyStateSubtext}>
              {activeTab === "active" ? "Create your first goal to get started!" : `No ${activeTab} goals to show.`}
            </Text>
          </View>
        ) : (
          filteredGoals.map(renderGoalCard)
        )}
      </ScrollView>

      {/* Add Goal Modal */}
      <Modal
        visible={showAddGoalModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddGoalModal(false)}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>New Goal</Text>
            <TouchableOpacity onPress={createGoal}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Goal Title *</Text>
              <TextInput
                style={styles.textInput}
                value={goalTitle}
                onChangeText={setGoalTitle}
                placeholder="Enter your goal title"
                multiline
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={goalDescription}
                onChangeText={setGoalDescription}
                placeholder="Add more details about your goal"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.inputLabel}>Target</Text>
                <TextInput
                  style={styles.textInput}
                  value={measurableTarget}
                  onChangeText={setMeasurableTarget}
                  placeholder="10"
                  keyboardType="numeric"
                />
              </View>

              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.inputLabel}>Unit</Text>
                <TextInput
                  style={styles.textInput}
                  value={measurableUnit}
                  onChangeText={setMeasurableUnit}
                  placeholder="kg, books, hours"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.categoryList}>
                  {CATEGORIES.map((category) => (
                    <TouchableOpacity
                      key={category.name}
                      style={[
                        styles.categoryButton,
                        selectedCategory.name === category.name && {
                          backgroundColor: category.color + "20",
                          borderColor: category.color,
                        },
                      ]}
                      onPress={() => setSelectedCategory(category)}
                    >
                      <Text style={styles.categoryIcon}>{category.icon}</Text>
                      <Text style={styles.categoryName}>{category.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Deadline (Optional)</Text>
              <TextInput
                style={styles.textInput}
                value={deadline}
                onChangeText={setDeadline}
                placeholder="YYYY-MM-DD"
              />
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Milestones Modal */}
      <Modal
        visible={showMilestonesModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowMilestonesModal(false)}>
              <Text style={styles.cancelButton}>Close</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Milestones</Text>
            <TouchableOpacity>
              <Text style={styles.saveButton}>+ Add</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {selectedGoal && (
              <View style={styles.goalSummary}>
                <Text style={styles.goalSummaryTitle}>{selectedGoal.title}</Text>
                <Text style={styles.goalSummaryProgress}>
                  Progress: {getGoalProgress(selectedGoal.id)}%
                </Text>
              </View>
            )}

            {milestones
              .filter((m: Milestone) => m.goalId === selectedGoal?.id)
              .map((milestone: Milestone) => (
                <View key={milestone.id} style={styles.milestoneCard}>
                  <View style={styles.milestoneHeader}>
                    <Text style={styles.milestoneTitle}>{milestone.title}</Text>
                    <Text style={styles.milestonePercentage}>{milestone.percentage}%</Text>
                  </View>
                  <Text style={[
                    styles.milestoneStatus,
                    { color: milestone.status === "completed" ? "#10B981" : "#6B7280" }
                  ]}>
                    {milestone.status.toUpperCase()}
                  </Text>
                </View>
              ))}

            {milestones.filter((m: Milestone) => m.goalId === selectedGoal?.id).length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No milestones yet</Text>
                <Text style={styles.emptyStateSubtext}>
                  Break down your goal into smaller milestones
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
  },
  addButton: {
    backgroundColor: "#6366F1",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#6366F1",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  activeTabText: {
    color: "#6366F1",
  },
  goalsList: {
    flex: 1,
    padding: 20,
  },
  goalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  goalHeader: {
    marginBottom: 12,
  },
  goalTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  goalTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  goalDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  goalMetrics: {
    marginBottom: 12,
  },
  metricText: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 2,
  },
  overdue: {
    color: "#EF4444",
    fontWeight: "600",
  },
  progressSection: {
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  milestonesText: {
    fontSize: 12,
    color: "#6B7280",
  },
  progressBar: {
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  goalActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  milestonesButton: {
    backgroundColor: "#6366F1",
  },
  completeButton: {
    backgroundColor: "#10B981",
  },
  deleteButton: {
    backgroundColor: "#EF4444",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  cancelButton: {
    fontSize: 16,
    color: "#6B7280",
  },
  saveButton: {
    fontSize: 16,
    color: "#6366F1",
    fontWeight: "600",
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  categoryList: {
    flexDirection: "row",
    gap: 12,
  },
  categoryButton: {
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    minWidth: 80,
  },
  categoryName: {
    fontSize: 12,
    color: "#374151",
    marginTop: 4,
  },
  goalSummary: {
    backgroundColor: "#F3F4F6",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  goalSummaryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  goalSummaryProgress: {
    fontSize: 14,
    color: "#6B7280",
  },
  milestoneCard: {
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  milestoneHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  milestoneTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
  },
  milestonePercentage: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#6366F1",
  },
  milestoneStatus: {
    fontSize: 12,
    fontWeight: "600",
  },
});