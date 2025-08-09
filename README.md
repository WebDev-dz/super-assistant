# AI Chat Feature for Todo Creation

This feature allows users to chat with an AI assistant to create and manage todos. The AI can understand natural language and automatically create structured todos with appropriate priorities, due dates, and descriptions.

## Features

### 🤖 AI-Powered Todo & Goal Creation
- Natural language processing to understand user intent
- Automatic extraction of todo details (title, description, priority, due date)
- Smart priority assignment based on urgency keywords
- Date parsing from natural language (e.g., "tomorrow", "next Friday")
- Multiple todo creation from complex requests
- Goal creation with milestones and tasks
- Structured project breakdown into multiple related todos

### 💬 Conversational Interface
- Chat-like interface similar to messaging apps
- Quick action buttons for common todo types
- Real-time AI responses
- Message history and context awareness
- Voice recording for hands-free todo creation

### 📝 Todo Integration
- Seamless integration with the existing todos system
- Automatic creation of todos from chat conversations
- Preview of todo details before creation
- One-click todo creation from chat

## How to Use

### Getting Started
1. Navigate to the "AI Chat" tab in the app
2. The AI assistant will greet you with helpful examples
3. Type your todo request in natural language or use voice recording

### Example Prompts
- "I need to buy groceries tomorrow"
- "Create a high priority task to finish the project by Friday"
- "I want to exercise 3 times this week"
- "Remind me to call the dentist next week"
- "I have a meeting with the client on Monday at 2pm"
- "I need to buy groceries, call the dentist, and finish my project" (creates 3 todos)
- "I want to learn Spanish this year" (creates a goal with milestones)
- "I have a big project with research, design, and implementation phases" (creates a goal with 3 milestones)

### Quick Actions
The chat interface includes quick action buttons for common todo types:
- Grocery shopping
- Project deadlines
- Exercise goals
- Appointment reminders

### Creating Todos & Goals
1. Type your request in the chat or use voice recording
2. The AI will analyze your message and extract relevant details
3. A preview of the todos/goals will appear in the chat
4. Click "Create Todo" or "Create Goal" to add them to your list
5. The items will appear in the main Todos/Goals tabs

**Multiple Items:**
- When you mention multiple tasks, the AI creates separate todos
- Complex projects are broken down into multiple related todos
- Goals with milestones create structured project plans
- All items can be created with a single click

### Voice Recording
1. Tap the 🎤 button next to the text input
2. Speak your todo request clearly
3. Tap "Stop Recording" when finished
4. The AI will process your voice and create a todo
5. Review and confirm the created todo

**Mobile Platforms (iOS/Android):**
- Audio files are sent directly to the AI API for processing
- Uses OpenAI Whisper for accurate transcription
- No reliance on device-specific speech recognition
- More reliable than built-in voice recognition

## Technical Implementation

### API Endpoints
- `/api/chat-api` - Main chat API endpoint
- `/api/ai+api` - Voice-to-todo conversion API

### AI Integration
- Uses OpenAI GPT-4o-mini for natural language processing
- OpenAI Whisper for audio transcription on mobile platforms
- Function calling for structured todo and goal creation
- Support for multiple todos and goals in single requests
- Context-aware conversations with message history
- Intelligent project breakdown and milestone creation

### Database Integration
- Todos created through chat are saved to InstantDB
- Integration with existing goals and milestones system
- Standalone todos for quick tasks

## File Structure

```
app/
├── chat.tsx              # Main chat interface
├── api/
│   ├── chat-api.ts       # Chat API endpoint
│   └── ai+api.ts         # Voice-to-todo API
└── _layout.tsx           # Tab navigation (updated)

components/
└── (existing components)

instant.schema.ts          # Database schema (includes chat entities)
```

## Configuration

### Environment Variables
Make sure to set up your OpenAI API key:
```bash
OPENAI_API_KEY=your_openai_api_key_here
```

### Dependencies
The feature uses these key dependencies:
- `openai` - OpenAI API client
- `zod` - Schema validation
- `@instantdb/react-native` - Database integration

## Future Enhancements

### Planned Features
- Enhanced voice input with better accuracy
- Todo templates and suggestions
- Bulk todo creation
- Smart categorization
- Integration with calendar events
- Todo completion tracking from chat

### Potential Improvements
- Multi-language support
- Advanced date parsing
- Recurring todo creation
- Todo editing through chat
- Integration with external calendars

## Troubleshooting

### Common Issues
1. **API Key Missing**: Ensure your OpenAI API key is properly configured
2. **Network Errors**: Check your internet connection
3. **Todo Creation Fails**: Verify the database connection

### Debug Mode
Enable debug logging by checking the browser console for detailed error messages.

## Contributing

To add new features to the chat system:
1. Update the AI system prompt in `chat-api.ts`
2. Add new function schemas for additional capabilities
3. Update the chat interface in `chat.tsx`
4. Test with various user inputs

## Support

For issues or questions about the chat feature, please check:
1. The console for error messages
2. Your OpenAI API key configuration
3. Network connectivity
4. Database connection status 