import { DemoBug } from './types';

export const DEMO_BUGS: DemoBug[] = [
  {
    id: 'js-off-by-one',
    title: 'JavaScript: Array Boundary Calculation',
    language: 'javascript',
    bugType: 'off-by-one',
    description: 'A classic loop boundary bug calculating student test averages.',
    code: `function calculateAverages(scores) {
  let total = 0;
  // Loop through all test score entries
  for (let i = 0; i <= scores.length; i++) {
    total += scores[i];
  }
  return total / scores.length;
}

const finalScore = calculateAverages([85, 92, 78, 90]);
console.log("Average:", finalScore);`,
    errorMessage: `Result is NaN (scores[4] evaluated to undefined during addition)`,
    precomputedAnalysis: {
      plain_english:
        'The loop iterates one step too far. Since JavaScript arrays are 0-indexed, the last element is at index length - 1. Accessing index length produces undefined, which ruins the math.',
      root_cause:
        'Using the <= operator instead of < causes the loop counter "i" to reach index 4 on a 4-item array. In JavaScript, scores[4] returns undefined, and (number + undefined) evaluates to NaN.',
      bug_type: 'off-by-one',
      line_numbers: [4],
      fixed_code: `function calculateAverages(scores) {
  let total = 0;
  // Use < scores.length to stop before out-of-bounds index
  for (let i = 0; i < scores.length; i++) {
    total += scores[i];
  }
  return total / scores.length;
}

const finalScore = calculateAverages([85, 92, 78, 90]);
console.log("Average:", finalScore);`,
      walkthrough: [
        'The array [85, 92, 78, 90] has length 4, with valid indices 0, 1, 2, and 3.',
        'The loop condition is "i <= scores.length", meaning it checks i = 0, 1, 2, 3, and 4.',
        'At iteration i = 4, scores[4] is accessed. No element exists at index 4, returning undefined.',
        'Adding total (345) + undefined results in NaN.',
        'Changing the condition to "i < scores.length" stops the loop cleanly at index 3.'
      ],
      prevention_tip:
        'Always use strictly less than (< array.length) for 0-indexed loop counters, or use modern array methods like scores.reduce().',
      severity: 'high'
    }
  },
  {
    id: 'py-type-mismatch',
    title: 'Python: Retirement Year Calculator',
    language: 'python',
    bugType: 'type-mismatch',
    description: 'Subtracting a string parsed from API payload from an integer constant.',
    code: `def calculate_retirement_timeline(user_profile):
    current_age = user_profile.get("age", "25")
    retirement_target = 65
    
    # Calculate years left until retirement milestone
    years_left = retirement_target - current_age
    return f"Retirement in {years_left} years"

candidate = {"name": "Alex", "age": "24"}
print(calculate_retirement_timeline(candidate))`,
    errorMessage: `TypeError: unsupported operand type(s) for -: 'int' and 'str'`,
    precomputedAnalysis: {
      plain_english:
        'Python is trying to subtract text (string) from a number (integer). Unlike some loosely typed languages, Python refuses to automatically convert text to numbers for arithmetic.',
      root_cause:
        'The value returned by user_profile.get("age", "25") is a string ("24"). Python raises a TypeError when attempting the "-" binary operator between an int (65) and a str ("24").',
      bug_type: 'type-mismatch',
      line_numbers: [6],
      fixed_code: `def calculate_retirement_timeline(user_profile):
    # Explicitly cast string age to integer
    current_age = int(user_profile.get("age", 25))
    retirement_target = 65
    
    years_left = retirement_target - current_age
    return f"Retirement in {years_left} years"

candidate = {"name": "Alex", "age": "24"}
print(calculate_retirement_timeline(candidate))`,
      walkthrough: [
        'The dictionary supplies {"age": "24"}, which is a string representation of a number.',
        'At line 6, the expression "65 - current_age" attempts integer subtraction on a string.',
        'Python strictly enforces data types and halts with a TypeError.',
        'Casting the value via int(user_profile.get("age", 25)) ensures the operand is numeric.'
      ],
      prevention_tip:
        'Sanitize external data and JSON inputs by casting numeric fields with int() or float() before mathematical operations.',
      severity: 'high'
    }
  },
  {
    id: 'java-null-pointer',
    title: 'Java: Email Domain Extractor',
    language: 'java',
    bugType: 'null/undefined',
    description: 'Calling a method on an uninitialized reference string.',
    code: `public class DomainParser {
    public static String extractDomain(String email) {
        // Find the @ delimiter and cut the domain suffix
        int atIndex = email.indexOf("@");
        return email.substring(atIndex + 1);
    }

    public static void main(String[] args) {
        String studentEmail = null;
        System.out.println("Extracted: " + extractDomain(studentEmail));
    }
}`,
    errorMessage: `Exception in thread "main" java.lang.NullPointerException: Cannot invoke "String.indexOf(String)" because "email" is null`,
    precomputedAnalysis: {
      plain_english:
        'The program attempts to perform an operation on a variable that points to nothing (null). You cannot check characters or search inside a non-existent string.',
      root_cause:
        'The caller passes studentEmail = null into extractDomain. Calling the instance method email.indexOf("@") causes the JVM to attempt dereferencing a null reference, triggering a NullPointerException.',
      bug_type: 'null/undefined',
      line_numbers: [4],
      fixed_code: `public class DomainParser {
    public static String extractDomain(String email) {
        // Defensively guard against null or missing delimiter
        if (email == null || !email.contains("@")) {
            return "unknown";
        }
        int atIndex = email.indexOf("@");
        return email.substring(atIndex + 1);
    }

    public static void main(String[] args) {
        String studentEmail = null;
        System.out.println("Extracted: " + extractDomain(studentEmail));
    }
}`,
      walkthrough: [
        'Variable studentEmail is initialized to null on line 9 and passed into extractDomain.',
        'On line 4, email.indexOf("@") executes.',
        'Because email is null, the JVM has no memory address to invoke methods upon.',
        'A NullPointerException is thrown immediately.',
        'Adding a guard clause (if email == null) protects the downstream string manipulation.'
      ],
      prevention_tip:
        'Employ defensive null-checks or use java.util.Optional<String> for values that might be absent.',
      severity: 'critical'
    }
  },
  {
    id: 'cpp-infinite-loop',
    title: 'C++: Launch Countdown Timer',
    language: 'cpp',
    bugType: 'infinite-loop',
    description: 'Unsigned integer comparison against zero causes infinite loop underflow.',
    code: `#include <iostream>

void runCountdown(unsigned int seconds) {
    // Count down from starting time to zero
    for (unsigned int t = seconds; t >= 0; t--) {
        std::cout << t << " seconds remaining..." << std::endl;
    }
    std::cout << "Liftoff!" << std::endl;
}

int main() {
    runCountdown(3);
    return 0;
}`,
    errorMessage: `Process timed out / Segmentation fault after printing 4294967295 iterations`,
    precomputedAnalysis: {
      plain_english:
        'The loop never stops because unsigned integers can never be negative. When zero is decremented, it wraps around to over 4 billion instead of -1.',
      root_cause:
        'Variable t is declared as unsigned int. The loop condition "t >= 0" is tautologically true for all unsigned integers. When t reaches 0 and is decremented (t--), it integer underflows to 2^32 - 1 (4,294,967,295), looping indefinitely.',
      bug_type: 'infinite-loop',
      line_numbers: [5],
      fixed_code: `#include <iostream>

void runCountdown(int seconds) {
    // Use signed integer so t can decrement to -1 and terminate
    for (int t = seconds; t >= 0; t--) {
        std::cout << t << " seconds remaining..." << std::endl;
    }
    std::cout << "Liftoff!" << std::endl;
}

int main() {
    runCountdown(3);
    return 0;
}`,
      walkthrough: [
        'Variable t is unsigned int, meaning its range is strictly [0, 4294967295].',
        'The loop condition t >= 0 can never evaluate to false.',
        'After printing 0, the expression t-- underflows, setting t = 4294967295.',
        'The condition remains true, locking the program in an unbounded loop.',
        'Switching to signed int allows t to become -1, cleanly breaking out.'
      ],
      prevention_tip:
        'Never use "unsigned_var >= 0" as a downward loop boundary condition. Use signed types for downward counters.',
      severity: 'critical'
    }
  }
];
