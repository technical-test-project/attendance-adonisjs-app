import vine, { SimpleMessagesProvider } from '@vinejs/vine'

vine.messagesProvider = new SimpleMessagesProvider({
  // Applicable for all fields
  required: 'The {{ field }} field is required',
  string: 'The value of {{ field }} field must be a string',
  email: 'The value is not a valid email address',
  number: 'The value of {{ field }} field must be a number',
})
