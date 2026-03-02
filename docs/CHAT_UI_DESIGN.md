# Chat UI Design for 3D Math Calculator

## Overview

Add a new "Chat" mode to the 3D Math Calculator that provides a conversational interface for users to perform mathematical operations through natural language dialogue.

## Design Goals

1. **Conversational Interaction**: Users can type math questions or commands in natural language
2. **Context Preservation**: Chat history maintained within session for reference
3. **Visual Feedback**: Clear distinction between user input and assistant responses
4. **Seamless Integration**: Leverages existing Intent parser functionality

## UI/UX Specification

### Layout Structure

```
+------------------------------------------+
|  3D Math Calculator                      |
+------------------------------------------+
| [Expr] [Vector] [Graph] [Surf] [View]   |
| [Matrix] [Intent] [Chat]                 |
+------------------------------------------+
|                                          |
|  +------------------------------------+  |
|  |  Chat Messages Container          |  |
|  |                                    |  |
|  |  [User message bubble - right]    |  |
|  |                                    |  |
|  |  [Assistant message bubble - left]|  |
|  |                                    |  |
|  +------------------------------------+  |
|                                          |
|  +------------------------------------+  |
|  |  Input: [Type message...]    [Send]|  |
|  +------------------------------------+  |
|                                          |
+------------------------------------------+
```

### Component Details

#### Chat Messages Container
- **Scrollable**: Vertical scroll with newest messages at bottom
- **Max Height**: 400px
- **Background**: Light gray (#f5f5f5)
- **Border Radius**: 12px
- **Padding**: 15px

#### Message Bubbles

**User Messages**:
- **Alignment**: Right
- **Background**: Gradient (#667eea to #764ba2) - matches app theme
- **Text Color**: White
- **Border Radius**: 16px (rounded corners, less rounded on sender side)
- **Max Width**: 70% of container
- **Padding**: 12px 16px
- **Margin**: 8px 0

**Assistant Messages**:
- **Alignment**: Left
- **Background**: White with subtle shadow
- **Text Color**: #333
- **Border Radius**: 16px
- **Max Width**: 70% of container
- **Padding**: 12px 16px
- **Margin**: 8px 0
- **Border**: 1px solid #e0e0e0

#### Input Area
- **Input Field**:
  - Full width minus send button
  - Placeholder: "Ask me anything... (e.g., 'what is sin(pi/2)' or 'plot x^2')"
  - Border: 2px solid #e0e0e0
  - Border Radius: 24px (pill shape)
  - Padding: 14px 20px
  
- **Send Button**:
  - Circular or pill-shaped
  - Icon: Send arrow (→) or paper plane
  - Background: Same gradient as user bubbles
  - Size: 44px height

### Visual Effects

- **Message Animation**: Fade in + slide up (0.3s ease)
- **Typing Indicator**: Three bouncing dots when processing
- **Scroll Behavior**: Auto-scroll to new messages

## Functionality Specification

### Core Features

1. **Natural Language Processing**
   - Parse user input using existing Intent parser
   - Support all calculator operations via chat
   - Handle ambiguous or incomplete queries with clarifying questions

2. **Mathematical Operations Support**
   - Expression evaluation ("calculate 2+2")
   - 2D graphs ("plot sin(x)")
   - 3D surfaces ("show surface x^2 + y^2")
   - Vector operations ("dot product of [1,2,3] and [4,5,6]")
   - Matrix operations ("inverse of [[1,2],[3,4]]")
   - Unit conversions

3. **Response Types**
   - **Text Results**: Plain text answers to calculation queries
   - **Visual Results**: Embedded graphs/surfaces in chat
   - **Error Messages**: Friendly error explanations
   - **Helpful Suggestions**: Offer related operations

4. **Session Context**
   - Maintain chat history during session
   - Reference previous calculations
   - "Use previous result" support

### User Interactions

1. **Send Message**: Enter key or click send button
2. **Clear Chat**: Button to clear conversation history
3. **Copy Result**: Click on result to copy to clipboard

### Edge Cases

1. **Empty Input**: Show placeholder message, don't send
2. **Unknown Command**: "I didn't understand that. Try 'help' for examples."
3. **Calculation Error**: Display friendly error with suggestion
4. **Very Long Input**: Truncate display, process normally
5. **Rapid Requests**: Queue and process sequentially

## Technical Implementation

### New Files

1. `chat.js` - Chat handling logic
2. Update `index.html` - Add Chat tab and container
3. Update `style.css` - Chat-specific styles

### Integration Points

- Reuse `intent-parser.js` for NLP
- Reuse existing canvas rendering for graphs
- Share calculation functions from `script.js`

### Code Structure

```javascript
// chat.js
class ChatInterface {
  constructor() {
    this.messages = [];
    this.inputElement = null;
    this.containerElement = null;
  }
  
  init() { /* Bind events */ }
  sendMessage(text) { /* Process and respond */ }
  addUserMessage(text) { /* Render user bubble */ }
  addAssistantMessage(content, type) { /* Render assistant bubble */ }
  processInput(text) { /* Use intent-parser */ }
  renderMessage(message) { /* DOM manipulation */ }
  scrollToBottom() { /* Auto-scroll */ }
}
```

## Simplicity Consideration

This design avoids:
- **Backend**: All processing client-side using existing intent-parser
- **LLM Integration**: Uses rule-based parsing (like Intent mode)
- **Persistent Storage**: Chat clears on page refresh
- **Complex State**: Minimal additional state management

## Acceptance Criteria

1. ✅ Chat tab appears in mode tabs
2. ✅ User can type and send messages
3. ✅ Messages appear in chat bubble format
4. ✅ Math queries return correct results
5. ✅ Graph/surface queries render inline
6. ✅ Error messages are user-friendly
7. ✅ Chat scrolls to newest message
8. ✅ Enter key sends message
9. ✅ Clear chat button works