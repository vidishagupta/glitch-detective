import { BugType, PracticeExercise, SupportedLanguage } from './types';

export const CURATED_PRACTICE_DRILLS: Record<BugType, PracticeExercise> = {
  'off-by-one': {
    id: 'drill-off-by-one',
    bug_type: 'off-by-one',
    language: 'javascript',
    title: 'Top Score Leaderboard Truncation',
    scenario:
      'You are developing a game tournament leaderboard. The function should extract the top 3 scores from a sorted list of players, but it currently returns 4 items instead of 3 due to improper slice index bounds.',
    buggy_code: `function getTopThreePlayers(players) {
  // Bug: Slice ending index extracts 4 items instead of top 3
  const topRanked = players.slice(0, 4);
  return topRanked;
}

const leaderboard = ["Nova", "Shadow", "Valkyrie", "Pulse", "Echo"];
console.log("Top 3:", getTopThreePlayers(leaderboard));`,
    expected_behavior: 'Should return only the top 3 players: ["Nova", "Shadow", "Valkyrie"].',
    hints: [
      'In JavaScript Array.prototype.slice(start, end), the "end" index is exclusive, meaning it slices up to but NOT including that index.',
      'To extract exactly 3 items from index 0, the end argument should be 3, not 4.'
    ]
  },
  'null/undefined': {
    id: 'drill-null-undefined',
    bug_type: 'null/undefined',
    language: 'javascript',
    title: 'User Profile City Lookup',
    scenario:
      'A dashboard component accesses a user’s address city. When a new user registers without providing an address, the code crashes with a TypeError.',
    buggy_code: `function getUserCity(user) {
  // Bug: Throws TypeError if user.address is undefined or null
  return user.address.city.toUpperCase();
}

const newUser = { id: 101, username: "dev_hacker" };
console.log("City:", getUserCity(newUser));`,
    expected_behavior: 'Safely return "UNKNOWN" or undefined without throwing a runtime crash if address is missing.',
    hints: [
      'Use optional chaining (?.) to safely traverse nested properties that may be undefined.',
      'Change "user.address.city" to "user?.address?.city?.toUpperCase() ?? \'UNKNOWN\'" or add a defensive if check.'
    ]
  },
  'type-mismatch': {
    id: 'drill-type-mismatch',
    bug_type: 'type-mismatch',
    language: 'python',
    title: 'Cart Total Price Calculation',
    scenario:
      'An e-commerce API passes price as a string formatted from currency input ("19.99") while quantity is an integer (3). Multiplication fails or produces repeated strings.',
    buggy_code: `def calculate_cart_subtotal(unit_price_str, quantity):
    # Bug: Multiplying string by int duplicates the text in Python
    subtotal = unit_price_str * quantity
    return subtotal

# Expected: 59.97 (float), but currently returns '19.9919.9919.99'
print("Subtotal:", calculate_cart_subtotal("19.99", 3))`,
    expected_behavior: 'Convert the string unit price to a float or Decimal before computing the product.',
    hints: [
      'Python strings multiplied by integers repeat the string rather than performing numeric arithmetic.',
      'Cast unit_price_str using float(unit_price_str) before multiplying with quantity.'
    ]
  },
  'scope': {
    id: 'drill-scope',
    bug_type: 'scope',
    language: 'javascript',
    title: 'Async Button Click Counter Closure',
    scenario:
      'In a UI loop, event listeners are registered using "var" instead of block-scoped "let", causing all click callbacks to log the final loop value.',
    buggy_code: `function setupLoggers() {
  const loggers = [];
  // Bug: "var i" is function-scoped, so all closures reference the same variable
  for (var i = 0; i < 3; i++) {
    loggers.push(function() {
      return "Agent #" + i;
    });
  }
  return loggers;
}

const agents = setupLoggers();
console.log(agents[0]()); // Prints Agent #3 instead of Agent #0`,
    expected_behavior: 'Each logger closure should capture its own iteration index (0, 1, and 2).',
    hints: [
      'The "var" keyword creates function-scoped variables that are hoisted and shared across loop iterations.',
      'Replace "var i = 0" with block-scoped "let i = 0" to create a fresh binding for each loop iteration.'
    ]
  },
  'async/promise': {
    id: 'drill-async-promise',
    bug_type: 'async/promise',
    language: 'javascript',
    title: 'Missing Await on Network Token Fetch',
    scenario:
      'An authorization middleware fetches a session token from an asynchronous store, but forgets to await the promise before checking its expiration.',
    buggy_code: `async function fetchSessionToken() {
  return Promise.resolve("tok_991823");
}

async function validateSession() {
  // Bug: Missing 'await' yields a Promise object instead of resolved token string
  const token = fetchSessionToken();
  if (token.startsWith("tok_")) {
    return "AUTHORIZED";
  }
  return "DENIED";
}

validateSession().catch(err => console.log("Crashed:", err.message));`,
    expected_behavior: 'Properly await fetchSessionToken() so token is evaluated as a resolved string.',
    hints: [
      'An async function always returns a Promise. You cannot call string methods like .startsWith() on a Promise object.',
      'Add the "await" keyword: "const token = await fetchSessionToken();".'
    ]
  },
  'infinite-loop': {
    id: 'drill-infinite-loop',
    bug_type: 'infinite-loop',
    language: 'python',
    title: 'Binary Search Midpoint Progression',
    scenario:
      'A binary search implementation fails to increment low or decrement high, getting stuck when target is not found.',
    buggy_code: `def search_index(items, target):
    low = 0
    high = len(items) - 1
    
    while low <= high:
        mid = (low + high) // 2
        if items[mid] == target:
            return mid
        elif items[mid] < target:
            # Bug: Does not advance past mid, loops forever
            low = mid
        else:
            high = mid
    return -1

print("Found at:", search_index([1, 3, 5, 7, 9], 4))`,
    expected_behavior: 'Advance pointers past midpoint with low = mid + 1 and high = mid - 1.',
    hints: [
      'If low is set to mid when low and high are adjacent, mid never changes, creating an infinite loop.',
      'Change "low = mid" to "low = mid + 1" and "high = mid" to "high = mid - 1".'
    ]
  },
  'syntax': {
    id: 'drill-syntax',
    bug_type: 'syntax',
    language: 'javascript',
    title: 'Unclosed Template Literal & Object Syntax',
    scenario:
      'A student builds a JSON payload with an unescaped string quote or missing closing bracket.',
    buggy_code: `function createAuditLog(action, status) {
  // Bug: Missing closing bracket in object return shorthand
  const logEntry = {
    timestamp: Date.now(),
    action: action,
    status: status
  
  return logEntry;
}`,
    expected_behavior: 'Properly close the object literal before the return statement.',
    hints: [
      'Look at the declaration of logEntry. Notice where the opening bracket { is.',
      'Add the closing bracket "};" before "return logEntry;".'
    ]
  },
  'logic': {
    id: 'drill-logic',
    bug_type: 'logic',
    language: 'javascript',
    title: 'Discount Threshold Condition Inversion',
    scenario:
      'A store offers a discount for orders over $100, but the operator gives discounts to smaller orders instead.',
    buggy_code: `function applyVIPDiscount(cartTotal) {
  // Bug: Relational operator < used instead of >
  if (cartTotal < 100) {
    return cartTotal * 0.85; // 15% discount mistakenly applied to low-value carts
  }
  return cartTotal;
}

console.log("VIP total on $150 order:", applyVIPDiscount(150)); // Returns 150 without discount`,
    expected_behavior: 'Apply the 15% discount if cartTotal is greater than or equal to 100.',
    hints: [
      'Check the conditional statement inside the if block.',
      'Invert the comparison operator to "cartTotal >= 100".'
    ]
  },
  'other': {
    id: 'drill-other',
    bug_type: 'other',
    language: 'python',
    title: 'Mutable Default Argument Trap',
    scenario:
      'A Python function uses a mutable empty list as a default parameter, leading to state leakage across multiple calls.',
    buggy_code: `def add_user_role(role, role_list=[]):
    # Bug: Default mutable list persists state across function invocations
    role_list.append(role)
    return role_list

print(add_user_role("admin"))     # ['admin']
print(add_user_role("editor"))    # ['admin', 'editor'] -- unexpected leaked state!`,
    expected_behavior: 'Default role_list to None and initialize a new list inside the function body.',
    hints: [
      'In Python, default parameter expressions are evaluated once at function definition time, not at runtime.',
      'Use "role_list=None" in the header, and check "if role_list is None: role_list = []".'
    ]
  }
};
