import * as React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Agenda, DateObject } from 'react-native-calendars';
import { useHandlers } from '@/hooks/data-provider';
import { Task } from '@/lib/types';
import { useRouter } from 'expo-router';

type AgendaItems = Record<string, Task[]>;

function toDateKey(iso?: string) {
	if (!iso) return '';
	try {
		const d = new Date(iso);
		const yyyy = d.getFullYear();
		const mm = String(d.getMonth() + 1).padStart(2, '0');
		const dd = String(d.getDate()).padStart(2, '0');
		return `${yyyy}-${mm}-${dd}`;
	} catch {
		return '';
	}
}

export default function CalendarScreen() {
	const router = useRouter();
	const { state, isLoading } = useHandlers();
	const tasks = React.useMemo(() => state.tasks ?? [], [state]);

	const items = React.useMemo<AgendaItems>(() => {
		const map: AgendaItems = {};
		tasks.forEach((t) => {
			const key = toDateKey(t.dueDate);
			if (!key) return;
			if (!map[key]) map[key] = [];
			map[key].push(t);
		});
		return map;
	}, [tasks]);

	const markedDates = React.useMemo(() => {
		const marks: Record<string, any> = {};
		Object.keys(items).forEach((k) => {
			marks[k] = {
				marked: items[k]?.length > 0,
				dots: items[k]?.slice(0, 3).map(() => ({ color: '#8B5CF6' })),
			};
		});
		return marks;
	}, [items]);

	if (isLoading) {
		return (
			<View className="flex-1 items-center justify-center bg-background">
				<ActivityIndicator />
				<Text className="mt-2 text-muted-foreground">Loading calendar…</Text>
			</View>
		);
	}

	return (
		<View className="flex-1 bg-background">
			<Agenda
				items={items}
				markedDates={markedDates}
                
				renderItem={(task: Task) => (
					<TouchableOpacity
						activeOpacity={0.8}
						className="mx-3 my-1 rounded-xl bg-card border border-border p-4"
						onPress={() => router.push({ pathname: '/todos/details/[id]', params: { id: task.id } })}
					>
						<Text className="text-foreground font-semibold">{task.title}</Text>
						{task.description ? (
							<Text numberOfLines={2} className="text-muted-foreground mt-1">
								{task.description}
							</Text>
						) : null}
						<View className="mt-2 flex-row items-center justify-between">
							<Text className="text-xs text-muted-foreground">Priority: {task.priority}</Text>
							{task.completed ? (
								<Text className="text-xs text-green-600">Completed</Text>
							) : (
								<Text className="text-xs text-amber-600">Pending</Text>
							)}
						</View>
					</TouchableOpacity>
				)}
				renderEmptyDate={() => (
					<View className="px-4 py-6">
						<Text className="text-muted-foreground">No tasks due this day</Text>
					</View>
				)}
				showClosingKnob
			/>
		</View>
	);
}


