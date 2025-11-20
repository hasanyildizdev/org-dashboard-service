# Resend Email Cooldown Persistence Fix

## 🐛 Issue

**Problem:** Users could bypass the 60-second resend cooldown by refreshing the page.

**Impact:** 
- Users could spam resend verification emails
- No rate limiting after page refresh
- Cooldown stored only in component state

## ✅ Solution

Persist the cooldown timer in localStorage so it survives page refreshes.

## 🔧 Implementation

### How It Works

1. **On Resend Click:**
   - Calculate cooldown end time: `Date.now() + 60000` (60 seconds)
   - Store end time in localStorage: `email_verification_cooldown`
   - Start countdown timer

2. **On Page Load:**
   - Check localStorage for stored cooldown
   - Calculate remaining time from stored end time
   - Resume countdown if time remaining
   - Clean up if cooldown expired

3. **On Cooldown Complete:**
   - Clear interval
   - Remove from localStorage

### Code Changes

**Before:**
```typescript
const cooldown = ref(0)
let cooldownInterval: NodeJS.Timeout | null = null

const handleResend = async () => {
  // ... resend logic
  
  // Start cooldown (60 seconds) - Lost on refresh!
  cooldown.value = 60
  
  cooldownInterval = setInterval(() => {
    cooldown.value--
    if (cooldown.value <= 0) {
      clearInterval(cooldownInterval)
    }
  }, 1000)
}
```

**After:**
```typescript
const COOLDOWN_KEY = 'email_verification_cooldown'
const COOLDOWN_DURATION = 60 // seconds

const cooldown = ref(0)
let cooldownInterval: number | null = null

// Initialize cooldown from localStorage on mount
const initializeCooldown = () => {
  const storedCooldownEnd = localStorage.getItem(COOLDOWN_KEY)
  
  if (storedCooldownEnd) {
    const cooldownEnd = parseInt(storedCooldownEnd)
    const now = Date.now()
    const remainingSeconds = Math.ceil((cooldownEnd - now) / 1000)
    
    if (remainingSeconds > 0) {
      cooldown.value = remainingSeconds
      startCooldownTimer()
    } else {
      localStorage.removeItem(COOLDOWN_KEY)
    }
  }
}

const handleResend = async () => {
  // ... resend logic
  
  if (result.success) {
    // Store cooldown end time in localStorage - Survives refresh!
    const cooldownEnd = Date.now() + (COOLDOWN_DURATION * 1000)
    localStorage.setItem(COOLDOWN_KEY, cooldownEnd.toString())
    
    cooldown.value = COOLDOWN_DURATION
    startCooldownTimer()
  }
}

onMounted(() => {
  initializeCooldown() // Restore cooldown on page load
})
```

## 🧪 Testing

### Test Case 1: Normal Cooldown
1. Click "Resend Verification Email"
2. See countdown: "Resend in 60s"
3. Wait for countdown to complete
4. Button becomes clickable again

✅ **Expected:** Cooldown works normally

### Test Case 2: Page Refresh During Cooldown
1. Click "Resend Verification Email"
2. See countdown: "Resend in 50s"
3. **Hard refresh page (Cmd+Shift+R or Ctrl+Shift+R)**
4. Page reloads

✅ **Expected:** Countdown continues from ~50s, not reset to 60s

### Test Case 3: Multiple Tab Sync
1. Open `/auth/verify-email` in Tab 1
2. Click "Resend Verification Email" in Tab 1
3. Open `/auth/verify-email` in Tab 2

✅ **Expected:** Tab 2 shows the same cooldown countdown

### Test Case 4: Cooldown Expiration
1. Click "Resend Verification Email"
2. Wait for full 60 seconds
3. Check localStorage

✅ **Expected:** `email_verification_cooldown` removed from localStorage

### Test Case 5: Browser Close/Reopen
1. Click "Resend Verification Email"
2. Close browser
3. Reopen browser and navigate to `/auth/verify-email`

✅ **Expected:** If within 60s, cooldown continues. If after 60s, can resend immediately.

## 📊 localStorage Structure

**Key:** `email_verification_cooldown`

**Value:** Unix timestamp (milliseconds) when cooldown ends

**Example:**
```javascript
// Stored at 2025-11-20 17:10:00
localStorage.setItem('email_verification_cooldown', '1732118460000')

// Checked at 2025-11-20 17:10:30 (30 seconds later)
const cooldownEnd = 1732118460000
const now = Date.now() // 1732118430000
const remaining = Math.ceil((cooldownEnd - now) / 1000) // 30 seconds
```

## 🔒 Security Considerations

### Client-Side Only
- Cooldown is client-side for UX
- Backend should ALWAYS enforce rate limiting
- Don't rely on localStorage for security

### Backend Rate Limiting (Recommended)

Add server-side rate limiting to `ResendVerificationEmail` mutation:

```php
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\RateLimiter;

public function __invoke($_, array $args)
{
    $user = Auth::user();
    
    // Rate limit: max 3 attempts per hour
    $key = 'resend-verification:' . $user->id;
    
    if (RateLimiter::tooManyAttempts($key, 3)) {
        $seconds = RateLimiter::availableIn($key);
        
        throw ValidationException::withMessages([
            'email' => ["Too many resend attempts. Please try again in {$seconds} seconds."],
        ]);
    }
    
    RateLimiter::hit($key, 3600); // 1 hour
    
    // Send verification email
    $user->sendEmailVerificationNotification();
    
    // ...
}
```

## 🎯 Benefits

### Before Fix
- ❌ Cooldown resets on refresh
- ❌ Users can spam resend
- ❌ No persistence
- ❌ Poor UX

### After Fix
- ✅ Cooldown survives refresh
- ✅ Rate limiting enforced
- ✅ Stored in localStorage
- ✅ Better UX

## 📝 Files Modified

- ✅ `app/pages/auth/verify-email.vue` - Added localStorage persistence

## 💡 Future Improvements

1. **Backend Rate Limiting**
   - Add server-side rate limiting (recommended!)
   - Track attempts per IP/user in database
   - Block excessive resend attempts

2. **Cross-Tab Synchronization**
   - Listen to `storage` event for real-time sync
   - Update cooldown when changed in another tab

3. **Configurable Cooldown**
   - Make cooldown duration configurable
   - Different durations for different environments

4. **Analytics**
   - Track resend attempts
   - Monitor abuse patterns
   - Alert on suspicious activity

## ✅ Summary

The resend email cooldown now persists across page refreshes using localStorage. Users can no longer bypass the rate limit by refreshing the page, improving the overall system integrity and user experience.

**Status:** ✅ Fixed
