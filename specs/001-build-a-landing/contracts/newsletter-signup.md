# Newsletter Signup API Contract

**Service**: Newsletter subscription handling  
**Method**: POST  
**Content-Type**: application/x-www-form-urlencoded

## Endpoint Options

### Option 1: Formspree (Recommended for MVP)
```
POST https://formspree.io/f/{newsletter-form-id}
```

### Option 2: Direct Email Service Integration
```
POST https://api.emailjs.com/api/v1.0/email/send
```

## Request Format (Formspree)

### Form Fields
```javascript
{
  "email": "string",           // Required: Valid email address
  "_subject": "Newsletter Subscription",
  "_replyto": "email",         // Same as email field
  "list": "newsletter"         // Static identifier
}
```

### Validation Rules
- **email**: RFC 5322 compliant email address
- **duplicate handling**: Service handles duplicate prevention
- **confirmation**: Double opt-in recommended for compliance

## Response Format

### Success Response (200 OK)
```json
{
  "ok": true,
  "message": "Successfully subscribed to newsletter"
}
```

### Duplicate Email (200 OK)
```json
{
  "ok": true, 
  "message": "Email already subscribed"
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

## Client-Side Implementation

### Newsletter Signup Handler
```javascript
async function submitNewsletterSignup(email) {
  try {
    // Client-side validation
    if (!isValidEmail(email)) {
      showFieldError('newsletter-email', 'Please enter a valid email address');
      return;
    }
    
    const formData = new FormData();
    formData.append('email', email);
    formData.append('_subject', 'Newsletter Subscription');
    formData.append('_replyto', email);
    formData.append('list', 'newsletter');
    
    const response = await fetch('https://formspree.io/f/{newsletter-form-id}', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });
    
    const result = await response.json();
    
    if (response.ok) {
      showSuccessMessage("Thank you! You've been subscribed to our newsletter.");
      clearNewsletterForm();
    } else {
      handleNewsletterErrors(result.errors);
    }
  } catch (error) {
    showErrorMessage("Sorry, there was a problem with your subscription. Please try again.");
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}
```

### User Experience Features
- Real-time email validation while typing
- Success confirmation with welcome message
- Clear error messaging for invalid emails
- Duplicate subscription handling (friendly message)
- Loading state during submission

## Privacy and Compliance

### GDPR Considerations
- Clear consent language on signup form
- Privacy policy link near subscription form
- Easy unsubscribe mechanism required
- Data processing disclosure

### CAN-SPAM Compliance
- Clear identification of sender
- Physical address in emails
- Prominent unsubscribe option
- Honor unsubscribe requests within 10 days

## Integration Setup

### Formspree Configuration
1. Create separate form for newsletter signups
2. Configure auto-response email template
3. Set up forwarding to email marketing service
4. Enable spam protection
5. Configure confirmation redirect page

### Testing Requirements
- Test valid email subscriptions
- Test invalid email validation
- Test duplicate email handling
- Test network error scenarios
- Verify email delivery and formatting
- Test unsubscribe functionality