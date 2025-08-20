import React, { useRef, useCallback } from 'react';
import { Alert, Animated, DefaultSectionT, Easing, SectionListData, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useRouter } from 'expo-router';
import { AgendaList, CalendarProvider, WeekCalendar, } from 'react-native-calendars';
import testIDs from './testIDs';
import { Calendar } from '~/components/deprecated-ui/calendar'; // Assuming a Calendar component exists
import ExpandableCalendarContainer from '@/components/ui/expandable-calendar';

import { getTheme, themeColor, lightThemeColor } from './mocks/theme';
import type XDate from 'xdate';
import db from '@/db';
import { Todo } from '@/lib/types';
import { useColorScheme } from '@/lib/useColorScheme';
import { useHandlers } from '@/hooks/data-provider';
import { tasksActions } from '@/lib/actions/tasks';
import { useNavigation } from '@react-navigation/native';
import { Form, FormDatePicker, FormField, FormInput } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import TodoAgendaItem from '@/components/cards/TodoAgendaItem';
const leftArrowIcon = require('./img/previous.png');
const rightArrowIcon = require('./img/next.png');

interface Props {
	weekView?: boolean;
}
const CHEVRON = require('./img/next.png');


const CalendarScreen = (props: Props) => {
	const { weekView: initialWeekView } = props;
	const [value, setValue] = React.useState(new Date().toISOString());
	const [isWeekView, setIsWeekView] = React.useState(initialWeekView ?? false);
	const form = useForm({
		resolver: zodResolver(z.object({ date: z.coerce.date() })),
		defaultValues: {
			date: new Date()
		}
	})
	const { updateTask } = useHandlers()
	const navigation = useNavigation();


	const { colorScheme } = useColorScheme();
	// Fetch tasks from the database using useQuery
	const { data, isLoading } = db.useQuery({ tasks: {} });
	const isDark = colorScheme === "dark";

	console.log({ isDark })
	// Convert tasks to agendaItems format
	// Group tasks by dueDate and reduce them into agendaItems
	const agendaItems: SectionListData<any, DefaultSectionT>[] = React.useMemo(() => {
		if (!data?.tasks) return [];

		const groupedTasks = data.tasks.reduce((acc, task) => {
			const dueDate = task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : 'No Due Date';
			if (!acc[dueDate]) {
				acc[dueDate] = [];
			}
			acc[dueDate].push(task as Todo);
			return acc;
		}, {} as Record<string, Todo[]>);

		return Object.entries(groupedTasks).map(([date, tasks]) => ({
			title: {title: date},
			data: tasks
		}));
	}, [data?.tasks]);





	const markedDates = React.useMemo(() => {
		const result: Record<string, { marked?: boolean; dotColor?: string; selected?: boolean }> = {};
		if (!data?.tasks) return result;

		const priorityColor: Record<string, string> = {
			low: '#10B981',
			medium: '#F59E0B',
			high: '#F97316',
			urgent: '#EF4444'
		};

		for (const task of data.tasks) {
			if (!task?.dueDate) continue;
			const dateKey = new Date(task.dueDate).toISOString().split('T')[0];
			const color = task.completed ? '#9CA3AF' : (priorityColor as any)[task.priority] || '#3B82F6';
			result[dateKey] = { ...(result[dateKey] || {}), marked: true, dotColor: color };
		}

		return result;
	}, [data?.tasks]);

	const theme = useRef(getTheme());
	const todayBtnTheme = useRef({
		todayButtonTextColor: themeColor
	});

	// const onDateChanged = useCallback((date, updateSource) => {
	//   console.log('ExpandableCalendarScreen onDateChanged: ', date, updateSource);
	// }, []);

	// const onMonthChange = useCallback(({dateString}) => {
	//   console.log('ExpandableCalendarScreen onMonthChange: ', dateString);
	// }, []);

	const handleToggleComplete = (id: string, completed: boolean) => {
		// For now, just log the change. You can implement the database update later
		const taskToUpdate = data?.tasks.find(t => t.id === id)
		updateTask({ ...taskToUpdate, completed })
	}

	const renderItem = useCallback(({ item }: any) => {
		return <TodoAgendaItem item={item} onToggleComplete={handleToggleComplete} />;
	}, [handleToggleComplete]);

	const calendarRef = useRef<{ toggleCalendarPosition: () => boolean }>(null);
	const rotation = useRef(new Animated.Value(0));

	const toggleCalendarExpansion = useCallback(() => {
		const isOpen = calendarRef.current?.toggleCalendarPosition();
		Animated.timing(rotation.current, {
			toValue: isOpen ? 1 : 0,
			duration: 200,
			useNativeDriver: true,
			easing: Easing.out(Easing.ease)
		}).start();
	}, []);

	const renderHeader = useCallback(
		(date?: XDate) => {
			const rotationInDegrees = rotation.current.interpolate({
				inputRange: [0, 1],
				outputRange: ['0deg', '-180deg']
			});
			return (
				<TouchableOpacity style={styles.header} onPress={toggleCalendarExpansion}>
					<Text style={styles.headerTitle}>{date?.toString('MMMM yyyy')}</Text>
					<Animated.Image source={CHEVRON} style={{ transform: [{ rotate: '90deg' }, { rotate: rotationInDegrees }] }} />
				</TouchableOpacity>
			);
		},
		[toggleCalendarExpansion]
	);

	const onCalendarToggled = useCallback(
		(isOpen: boolean) => {
			rotation.current.setValue(isOpen ? 1 : 0);
		},
		[rotation]
	);


	if (isLoading) {
		return (
			<Text>Loading tasks...</Text>
		);
	}

	return (
		<CalendarProvider
			date={(form.watch("date")) as string}
			showTodayButton
			theme={todayBtnTheme.current}
		>

			<View className="px-4 py-3 flex-row items-center justify-between bg-background border-b border-border">
				<TouchableOpacity
					onPress={() => (navigation as any)?.openDrawer()}
					className="p-2 -ml-2"
				>
					<Ionicons
						name="menu-outline"
						size={24}
						color={isDark ? '#E5E7EB' : '#374151'}
					/>
				</TouchableOpacity>

				<View className="flex-row items-center gap-3">
					<TouchableOpacity
						onPress={() => setIsWeekView(!isWeekView)}
						className="flex-row items-center bg-secondary/10 px-3 py-1.5 rounded-full"
					>
						<Ionicons
							name={isWeekView ? "calendar-outline" : "calendar-sharp"}
							size={16}
							color={isDark ? '#9CA3AF' : '#6B7280'}
							className="mr-1"
						/>
						<Text className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
							{isWeekView ? 'Month' : 'Week'}
						</Text>
					</TouchableOpacity>
				</View>

				<TouchableOpacity className="p-2 -mr-2">
					<Ionicons
						name="search-outline"
						size={24}
						color={isDark ? '#E5E7EB' : '#374151'}
					/>
				</TouchableOpacity>
			</View>
			<Form {...form}>
				<ExpandableCalendarContainer
					expanded={!isWeekView}
					className="w-full"
					collapsedClassName="items-center"
					expandedClassName="items-center"
					collapsedContent={(
						<FormField name='date' render={({ field: { value, onChange } }) => (
							<WeekCalendar
								testID={testIDs.weekCalendar.CONTAINER}
								firstDay={1}
								markedDates={markedDates}
								theme={{
									textSectionTitleColor: isDark ? '#9CA3AF' : '#6B7280',
									todayTextColor: themeColor,
									selectedDayBackgroundColor: themeColor,
									selectedDayTextColor: '#FFFFFF',
									textDayFontSize: 16
								}}
								onDayPress={onChange}
								current={value}
							/>
						)} />
					)}
					expandedContent={(
						<FormField name='date' render={({ field: { value, onChange } }) => (
							<Calendar
								// @ts-ignore
								onDayPress={(day) => {
									onChange?.(day.dateString === value ? '' : day.dateString);
								}}
								markedDates={{
									...markedDates,
									[value ?? '']: {
										selected: true,
										...(markedDates?.[value ?? ''] || {})
									},
								}}
								theme={{
									textSectionTitleColor: isDark ? '#9CA3AF' : '#6B7280',
									timeLabel: {
										color: isDark ? '#9CA3AF' : '#6B7280',
									}
								}}
								current={value}
								{...props}
							/>
						)} />
					)}
				/>
			</Form>

			<AgendaList
				sections={agendaItems || []}
				renderItem={renderItem}
				
				sectionStyle={{
					justifyContent: "center",
					alignItems: "center",
					backgroundColor: isDark ? '#E5E7EB' : '#374151'
				}}
				renderSectionHeader={(section) => {

					console.log({section})
					return (
					<View className={cn("flex justify-center border-gray-200 border-[1px] py-3 items-center px-4", {
						" bg-gray-900": isDark,
						" bg-white": !isDark
					})}>
						<Text className={cn("text-2xl", {
							"text-white bg-gray-900": isDark,
							"text-black bg-white": !isDark
						})}>{new Date(section?.title).toDateString()}</Text>
					</View>
	)}}
				dayFormat={'yyyy-MM-d'}
			/>
		</CalendarProvider>
	);
};

export default CalendarScreen;

const styles = StyleSheet.create({

	header: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginVertical: 10
	},
	section: {
		backgroundColor: lightThemeColor,
		color: 'grey',
		textTransform: 'capitalize'
	},
	headerTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		marginRight: 6
	},

});