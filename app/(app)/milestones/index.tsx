import React, { useMemo } from 'react';
import { View, FlatList } from 'react-native';
import { Text } from '~/components/ui/text';
import { useHandlers } from '@/hooks/data-provider';
import { useColorScheme } from '@/lib/useColorScheme';
import { useModalManager } from '@/hooks/useModalManager';
import { MileStoneCard } from '@/components/MileStoneCard';
import MilestoneDetailsModal from '@/components/modals/MilestoneDetailsModal';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MilestonesListScreen() {
  const { state, updateMilestone, deleteMilestone } = useHandlers();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { modalState, openMilestoneDetails, closeMilestoneDetails } = useModalManager();
  const milestones = state.milestones ?? [];

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <FlatList
        data={milestones}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => (
          <MileStoneCard
            milestone={item as any}
            onPress={() => openMilestoneDetails(item as any)}
            onEdit={() => {}}
            onComplete={() => {}}
          />
        )}
        ListEmptyComponent={<Text className={`text-center mt-10 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>No milestones yet</Text>}
      />
      
      {/* Milestone Details Modal */}
      <MilestoneDetailsModal
        milestone={modalState.milestoneDetails.milestone}
        isOpen={modalState.milestoneDetails.isOpen}
        onClose={closeMilestoneDetails}
        onEdit={(milestone) => {
          // TODO: Implement edit functionality
          console.log('Edit milestone:', milestone);
        }}
      />
    </SafeAreaView>
  );
}


