# Contact Form API Contract

**Service**: Contact form submission handling  
**Method**: POST  
**Content-Type**: application/x-www-form-urlencoded

## Endpoint
```
POST https://formspree.io/f/{form-id}
```

## Request Format

### Form Fields
```javascript
{
  "name": "string",      // Required: 2-50 characters
  "email": "string",     // Required: Valid email format
  "subject": "string",   // Required: 5-100 characters  
  "message": "string",   // Required: 20-2000 characters
  "_replyto": "string",  // Auto-populated with user email
  "_subject": "string"   // Auto-populated with subject
}
```

### Validation Rules
- **name**: 2-50 characters, letters, spaces, hyphens, apostrophes only
- **email**: RFC 5322 compliant email address
- **subject**: 5-100 characters, no HTML tags
- **message**: 20-2000 characters, basic text only

## Response Format

### Success Response (200 OK)
```json
{
  "ok": true,
  "next": "https://formspree.io/thanks"
}
```

### Validation Error (422 Unprocessable Entity)  
```json
{
  "ok": false,
  "errors": [
    {
      "field": "email",
      "code": "INVALID_EMAIL", 
      "message": "Please enter a valid email address"
    }
  ]
}
```

### Rate Limit Error (429 Too Many Requests)
```json
{
  "ok": false,
  "error": "Too many requests. Please try again later."
}
```

## Client-Side Implementation

### Form Submission Handler
```javascript
async function submitContactForm(formData) {
  try {
    const response = await fetch('https://formspree.io/f/{form-id}', {
      method: 'POST',
      body: new FormData(formData),
      headers: {
        'Accept': 'application/json'
      }
    });
    
    const result = await response.json();
    
    if (response.ok) {
      showSuccessMessage("Thank you! Your message has been sent.");
      resetForm();
    } else {
      handleFormErrors(result.errors);
    }
  } catch (error) {
    showErrorMessage("Sorry, there was a problem sending your message. Please try again.");
  }
}
```

### Error Handling
- Display specific field errors next to form inputs
- Show general error message for network/server issues
- Maintain form data on validation errors
- Clear errors when user starts typing

## Integration Notes

### Setup Requirements
1. Create Formspree account
2. Register form endpoint
3. Configure email forwarding
4. Set up spam protection
5. Add form ID to JavaScript configuration

### Testing Strategy
- Test successful submissions with valid data
- Test validation with invalid inputs
- Test network error handling
- Test spam protection functionality
- Verify email delivery and formatting