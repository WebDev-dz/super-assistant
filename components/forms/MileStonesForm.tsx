import { CreateMilestoneSchema, Milestone, MilestoneSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm, UseFormReturn, Controller, ControllerRenderProps } from "react-hook-form";
import { z } from "zod";
import { FlatList, View, Text } from "react-native";
import { Button } from "@/components/ui/button";
import { FormField, FormInput, FormLabel, FormDatePicker, Form } from "@/components/ui/form";
import { MileStoneCard } from "./MileStoneCard";
import db from "@/db";
import { addMilestone } from "@/lib/actions/milestones";
import { id } from "@instantdb/react-native";

// Define the form schema
const formSchema = z.object({
    milestones: z
        .array(CreateMilestoneSchema)
        .min(1, "At least one milestone is required"),
});

// Type for the form data
type FormData = z.infer<typeof formSchema>;

// Props for MileStonesForm
type MileStonesFormProps = {
    goalId: string;
    initialMileStones?: Milestone[];  
};

const MileStonesForm = ({ goalId, initialMileStones }: MileStonesFormProps) => {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            milestones: initialMileStones || [
                {
                    title: "",
                    percentage: 0,
                    deadline: new Date().toDateString(),
                    description: "",
                },
            ],
        },
    });

    const milestones = form.watch("milestones");

    // Handle form submission (example)
    const onSubmitMilestone = (data: z.infer<typeof formSchema>) => {
        console.log("Form submitted:", data);
        // Add logic to save milestones to InstantDB
        const g = data.milestones.forEach(async (milestone) => {

            addMilestone({
                ...milestone,
                goalId,
                status: "not_started", // Default status
                completed: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                id: id()
            });
            
        });
        // Here you would typically send `g` to your backend or InstantDB
        
        console.log("Formatted Milestones for DB:", g);
    };

    return (
        <View style={{ flex: 1 }}>
            <Form {...form}>
            <FlatList
                data={milestones}
                keyExtractor={(item, index) => `milestone-${index}`}
                renderItem={({ item, index }) => (
                    <FormField
                        control={form.control}
                        name={`milestones.${index}`}
                        render={({ field }) => (
                            index === milestones.length - 1 ? (
                                <CreateMilestoneForm
                                    milestone={item as z.infer<typeof CreateMilestoneSchema>}
                                    onChange={(value) => {
                                        const updatedMilestones = [...milestones];
                                        updatedMilestones[index] = value;
                                        form.setValue("milestones", updatedMilestones);
                                    }}
                                    form={form as UseFormReturn<FormData>}
                                    field ={field}
                                    index={index}
                                />
                            ) : (
                                // @ts-ignore
                                <MileStoneCard milestone={item as FormData["milestones"][0]} />
                            )
                        )}
                    />
                )}
                ListHeaderComponent={() => (
                    <View style={{ padding: 16 }}>
                        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Milestones</Text>
                        <Text style={{ color: "#666" }}>
                            Define key milestones for your goal.
                        </Text>
                    </View>
                )}
                ListFooterComponent={() => (
                    <Button
                        onPress={() => {
                            const newMilestone = {
                                title: "",
                                percentage: 0,
                                deadline : new Date().toISOString(),
                                description: "",
                                status: "not_started" as const,
                                priority: "low" as const,
                                goalId,
                                completed: false,
                            };
                            form.setValue("milestones", [...milestones, newMilestone]);
                        }}
                        style={{ margin: 16 }}
                    >
                        Add Milestone
                    </Button>
                )}
            />
            </Form>
            <Button onPress={form.handleSubmit(onSubmitMilestone)} style={{ margin: 16 }}>
                Save Milestones
            </Button>
        </View>
    );
};

// Props for CreateMilestoneForm
type CreateMilestoneFormProps = {
    milestone: z.infer<typeof CreateMilestoneSchema>;
    form: UseFormReturn<FormData>;
    index: number;
    onChange: (value: z.infer<typeof CreateMilestoneSchema>) => void;
    field: ControllerRenderProps<z.infer<typeof formSchema>, `milestones.${number}`>;
};

const CreateMilestoneForm = ({
    milestone,
    form,
    index,
    onChange,
    field,
}: CreateMilestoneFormProps) => {
    return (
        <View style={{ padding: 16, borderWidth: 1, borderColor: "#ddd", margin: 8 }}>
            <FormField
                control={form.control}
                name={`milestones.${index}`}
                render={({  }) => (
                    <View>
                        <FormLabel>Title</FormLabel>
                        <FormInput
                            {...field}
                            name={`milestones.${index}.title`}
                            // value={field.value.title}
                            // onChangeText={(value) => form.setValue(`milestones.${index}.title`, value)}
                            placeholder="Enter milestone title"
                        />
                        <FormLabel>Percentage</FormLabel>
                        <FormInput
                            {...field}
                            name={`milestones.${index}.percentage`}
                            // value={field.value.percentage?.toString()}
                            keyboardType="numeric"
                            // onChangeText={(value) => {
                            //     const percentage = parseFloat(value);
                            //     if (!isNaN(percentage) && percentage >= 0 && percentage <= 100) {
                            //         onChange({ ...field.value, percentage });
                            //     }
                            // }}
                            placeholder="Enter percentage (0-100)"
                        />
                        <FormLabel>Deadline</FormLabel>
                        <FormDatePicker
                            {...field}
                            name={`milestones.${index}.deadline`}
                            value={field.value.deadline}
                            // onChange={(date) =>
                            //     onChange({ ...field.value, deadline: date })
                            // }
                        />
                        <FormLabel>Description</FormLabel>
                        <FormInput
                            {...field}
                            name={`milestones.${index}.description`}

                            // value={field.value.description || ""}
                            // onChangeText={(value) =>
                            //     onChange({ ...field.value, description: value })
                            // }
                            placeholder="Enter description (optional)"
                            multiline
                        />
                    </View>
                )}
            />
        </View>
    );
};

export default MileStonesForm;