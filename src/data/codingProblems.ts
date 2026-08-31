export const codingProblemsData = [
  {
    "id": 1,
    "title": "Two Sum",
    "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    "example": "Input: nums = [2,7,11,15], target = 9\nOutput: [0, 1]",
    "defaultCode": "def two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        if target - num in seen:\n            return [seen[target - num], i]\n        seen[num] = i\n    return []\n\nprint(two_sum([2, 7, 11, 15], 9))",
    "difficulty": "Easy"
  },
  {
    "id": 2,
    "title": "Reverse Array",
    "description": "Write a Python function reverse_array(arr) that takes a list of integers and returns it in reverse order without using built-in reverse().",
    "example": "Input: [1, 2, 3]\nOutput: [3, 2, 1]",
    "defaultCode": "def reverse_array(arr):\n    left, right = 0, len(arr) - 1\n    while left < right:\n        arr[left], arr[right] = arr[right], arr[left]\n        left += 1\n        right -= 1\n    return arr\n\nprint(reverse_array([1, 2, 3]))",
    "difficulty": "Easy"
  },
  {
    "id": 3,
    "title": "Valid Parentheses",
    "description": "Given a string s containing just the characters (, ), {, }, [ and ], determine if the input string is valid.",
    "example": "Input: s = \"()[]{}\"\nOutput: True",
    "defaultCode": "def is_valid(s):\n    stack = []\n    mapping = { \")\": \"(\", \"}\": \"{\", \"]\": \"[\" }\n    for char in s:\n        if char in mapping:\n            top = stack.pop() if stack else \"#\"\n            if mapping[char] != top:\n                return False\n        else:\n            stack.append(char)\n    return not stack\n\nprint(is_valid(\"()[]{}\"))",
    "difficulty": "Medium"
  },
  {
    "id": 4,
    "title": "Problem 4: Algorithmic Challenge",
    "description": "Write a Python function solve_4(arr) that processes an array efficiently in O(n) time.",
    "example": "Input: [1, 2, 4]\nOutput: [4, 2, 1]",
    "defaultCode": "def solve_4(arr):\n    # Write your code here\n    pass\n\n# Test\nprint(solve_4([1, 2, 4]))",
    "difficulty": "Medium"
  },
  {
    "id": 5,
    "title": "Problem 5: Algorithmic Challenge",
    "description": "Write a Python function solve_5(arr) that processes an array efficiently in O(n) time.",
    "example": "Input: [1, 2, 5]\nOutput: [5, 2, 1]",
    "defaultCode": "def solve_5(arr):\n    # Write your code here\n    pass\n\n# Test\nprint(solve_5([1, 2, 5]))",
    "difficulty": "Easy"
  },
  {
    "id": 6,
    "title": "Problem 6: Algorithmic Challenge",
    "description": "Write a Python function solve_6(arr) that processes an array efficiently in O(n) time.",
    "example": "Input: [1, 2, 6]\nOutput: [6, 2, 1]",
    "defaultCode": "def solve_6(arr):\n    # Write your code here\n    pass\n\n# Test\nprint(solve_6([1, 2, 6]))",
    "difficulty": "Medium"
  },
  {
    "id": 7,
    "title": "Problem 7: Algorithmic Challenge",
    "description": "Write a Python function solve_7(arr) that processes an array efficiently in O(n) time.",
    "example": "Input: [1, 2, 7]\nOutput: [7, 2, 1]",
    "defaultCode": "def solve_7(arr):\n    # Write your code here\n    pass\n\n# Test\nprint(solve_7([1, 2, 7]))",
    "difficulty": "Easy"
  },
  {
    "id": 8,
    "title": "Problem 8: Algorithmic Challenge",
    "description": "Write a Python function solve_8(arr) that processes an array efficiently in O(n) time.",
    "example": "Input: [1, 2, 8]\nOutput: [8, 2, 1]",
    "defaultCode": "def solve_8(arr):\n    # Write your code here\n    pass\n\n# Test\nprint(solve_8([1, 2, 8]))",
    "difficulty": "Medium"
  },
  {
    "id": 9,
    "title": "Problem 9: Algorithmic Challenge",
    "description": "Write a Python function solve_9(arr) that processes an array efficiently in O(n) time.",
    "example": "Input: [1, 2, 9]\nOutput: [9, 2, 1]",
    "defaultCode": "def solve_9(arr):\n    # Write your code here\n    pass\n\n# Test\nprint(solve_9([1, 2, 9]))",
    "difficulty": "Easy"
  },
  {
    "id": 10,
    "title": "Problem 10: Algorithmic Challenge",
    "description": "Write a Python function solve_10(arr) that processes an array efficiently in O(n) time.",
    "example": "Input: [1, 2, 10]\nOutput: [10, 2, 1]",
    "defaultCode": "def solve_10(arr):\n    # Write your code here\n    pass\n\n# Test\nprint(solve_10([1, 2, 10]))",
    "difficulty": "Medium"
  },
  {
    "id": 11,
    "title": "Problem 11: Algorithmic Challenge",
    "description": "Write a Python function solve_11(arr) that processes an array efficiently in O(n) time.",
    "example": "Input: [1, 2, 11]\nOutput: [11, 2, 1]",
    "defaultCode": "def solve_11(arr):\n    # Write your code here\n    pass\n\n# Test\nprint(solve_11([1, 2, 11]))",
    "difficulty": "Easy"
  },
  {
    "id": 12,
    "title": "Problem 12: Algorithmic Challenge",
    "description": "Write a Python function solve_12(arr) that processes an array efficiently in O(n) time.",
    "example": "Input: [1, 2, 12]\nOutput: [12, 2, 1]",
    "defaultCode": "def solve_12(arr):\n    # Write your code here\n    pass\n\n# Test\nprint(solve_12([1, 2, 12]))",
    "difficulty": "Medium"
  },
  {
    "id": 13,
    "title": "Problem 13: Algorithmic Challenge",
    "description": "Write a Python function solve_13(arr) that processes an array efficiently in O(n) time.",
    "example": "Input: [1, 2, 13]\nOutput: [13, 2, 1]",
    "defaultCode": "def solve_13(arr):\n    # Write your code here\n    pass\n\n# Test\nprint(solve_13([1, 2, 13]))",
    "difficulty": "Easy"
  },
  {
    "id": 14,
    "title": "Problem 14: Algorithmic Challenge",
    "description": "Write a Python function solve_14(arr) that processes an array efficiently in O(n) time.",
    "example": "Input: [1, 2, 14]\nOutput: [14, 2, 1]",
    "defaultCode": "def solve_14(arr):\n    # Write your code here\n    pass\n\n# Test\nprint(solve_14([1, 2, 14]))",
    "difficulty": "Medium"
  },
  {
    "id": 15,
    "title": "Problem 15: Algorithmic Challenge",
    "description": "Write a Python function solve_15(arr) that processes an array efficiently in O(n) time.",
    "example": "Input: [1, 2, 15]\nOutput: [15, 2, 1]",
    "defaultCode": "def solve_15(arr):\n    # Write your code here\n    pass\n\n# Test\nprint(solve_15([1, 2, 15]))",
    "difficulty": "Easy"
  },
  {
    "id": 16,
    "title": "Problem 16: Algorithmic Challenge",
    "description": "Write a Python function solve_16(arr) that processes an array efficiently in O(n) time.",
    "example": "Input: [1, 2, 16]\nOutput: [16, 2, 1]",
    "defaultCode": "def solve_16(arr):\n    # Write your code here\n    pass\n\n# Test\nprint(solve_16([1, 2, 16]))",
    "difficulty": "Medium"
  },
  {
    "id": 17,
    "title": "Problem 17: Algorithmic Challenge",
    "description": "Write a Python function solve_17(arr) that processes an array efficiently in O(n) time.",
    "example": "Input: [1, 2, 17]\nOutput: [17, 2, 1]",
    "defaultCode": "def solve_17(arr):\n    # Write your code here\n    pass\n\n# Test\nprint(solve_17([1, 2, 17]))",
    "difficulty": "Easy"
  },
  {
    "id": 18,
    "title": "Problem 18: Algorithmic Challenge",
    "description": "Write a Python function solve_18(arr) that processes an array efficiently in O(n) time.",
    "example": "Input: [1, 2, 18]\nOutput: [18, 2, 1]",
    "defaultCode": "def solve_18(arr):\n    # Write your code here\n    pass\n\n# Test\nprint(solve_18([1, 2, 18]))",
    "difficulty": "Medium"
  },
  {
    "id": 19,
    "title": "Problem 19: Algorithmic Challenge",
    "description": "Write a Python function solve_19(arr) that processes an array efficiently in O(n) time.",
    "example": "Input: [1, 2, 19]\nOutput: [19, 2, 1]",
    "defaultCode": "def solve_19(arr):\n    # Write your code here\n    pass\n\n# Test\nprint(solve_19([1, 2, 19]))",
    "difficulty": "Easy"
  },
  {
    "id": 20,
    "title": "Problem 20: Algorithmic Challenge",
    "description": "Write a Python function solve_20(arr) that processes an array efficiently in O(n) time.",
    "example": "Input: [1, 2, 20]\nOutput: [20, 2, 1]",
    "defaultCode": "def solve_20(arr):\n    # Write your code here\n    pass\n\n# Test\nprint(solve_20([1, 2, 20]))",
    "difficulty": "Medium"
  },
  {
    "id": 21,
    "title": "Problem 21: Algorithmic Challenge",
    "description": "Write a Python function solve_21(arr) that processes an array efficiently in O(n) time.",
    "example": "Input: [1, 2, 21]\nOutput: [21, 2, 1]",
    "defaultCode": "def solve_21(arr):\n    # Write your code here\n    pass\n\n# Test\nprint(solve_21([1, 2, 21]))",
    "difficulty": "Easy"
  },
  {
    "id": 22,
    "title": "Problem 22: Algorithmic Challenge",
    "description": "Write a Python function solve_22(arr) that processes an array efficiently in O(n) time.",
    "example": "Input: [1, 2, 22]\nOutput: [22, 2, 1]",
    "defaultCode": "def solve_22(arr):\n    # Write your code here\n    pass\n\n# Test\nprint(solve_22([1, 2, 22]))",
    "difficulty": "Medium"
  },
  {
    "id": 23,
    "title": "Problem 23: Algorithmic Challenge",
    "description": "Write a Python function solve_23(arr) that processes an array efficiently in O(n) time.",
    "example": "Input: [1, 2, 23]\nOutput: [23, 2, 1]",
    "defaultCode": "def solve_23(arr):\n    # Write your code here\n    pass\n\n# Test\nprint(solve_23([1, 2, 23]))",
    "difficulty": "Easy"
  },
  {
    "id": 24,
    "title": "Problem 24: Algorithmic Challenge",
    "description": "Write a Python function solve_24(arr) that processes an array efficiently in O(n) time.",
    "example": "Input: [1, 2, 24]\nOutput: [24, 2, 1]",
    "defaultCode": "def solve_24(arr):\n    # Write your code here\n    pass\n\n# Test\nprint(solve_24([1, 2, 24]))",
    "difficulty": "Medium"
  },
  {
    "id": 25,
    "title": "Problem 25: Algorithmic Challenge",
    "description": "Write a Python function solve_25(arr) that processes an array efficiently in O(n) time.",
    "example": "Input: [1, 2, 25]\nOutput: [25, 2, 1]",
    "defaultCode": "def solve_25(arr):\n    # Write your code here\n    pass\n\n# Test\nprint(solve_25([1, 2, 25]))",
    "difficulty": "Easy"
  },
  {
    "id": 26,
    "title": "Problem 26: Algorithmic Challenge",
    "description": "Write a Python function solve_26(arr) that processes an array efficiently in O(n) time.",
    "example": "Input: [1, 2, 26]\nOutput: [26, 2, 1]",
    "defaultCode": "def solve_26(arr):\n    # Write your code here\n    pass\n\n# Test\nprint(solve_26([1, 2, 26]))",
    "difficulty": "Medium"
  },
  {
    "id": 27,
    "title": "Problem 27: Algorithmic Challenge",
    "description": "Write a Python function solve_27(arr) that processes an array efficiently in O(n) time.",
    "example": "Input: [1, 2, 27]\nOutput: [27, 2, 1]",
    "defaultCode": "def solve_27(arr):\n    # Write your code here\n    pass\n\n# Test\nprint(solve_27([1, 2, 27]))",
    "difficulty": "Easy"
  },
  {
    "id": 28,
    "title": "Problem 28: Algorithmic Challenge",
    "description": "Write a Python function solve_28(arr) that processes an array efficiently in O(n) time.",
    "example": "Input: [1, 2, 28]\nOutput: [28, 2, 1]",
    "defaultCode": "def solve_28(arr):\n    # Write your code here\n    pass\n\n# Test\nprint(solve_28([1, 2, 28]))",
    "difficulty": "Medium"
  },
  {
    "id": 29,
    "title": "Problem 29: Algorithmic Challenge",
    "description": "Write a Python function solve_29(arr) that processes an array efficiently in O(n) time.",
    "example": "Input: [1, 2, 29]\nOutput: [29, 2, 1]",
    "defaultCode": "def solve_29(arr):\n    # Write your code here\n    pass\n\n# Test\nprint(solve_29([1, 2, 29]))",
    "difficulty": "Easy"
  },
  {
    "id": 30,
    "title": "Problem 30: Algorithmic Challenge",
    "description": "Write a Python function solve_30(arr) that processes an array efficiently in O(n) time.",
    "example": "Input: [1, 2, 30]\nOutput: [30, 2, 1]",
    "defaultCode": "def solve_30(arr):\n    # Write your code here\n    pass\n\n# Test\nprint(solve_30([1, 2, 30]))",
    "difficulty": "Medium"
  },
  {
    "id": 31,
    "title": "Problem 31: Algorithmic Challenge",
    "description": "Write a Python function solve_31(arr) that processes an array efficiently in O(n) time.",
    "example": "Input: [1, 2, 31]\nOutput: [31, 2, 1]",
    "defaultCode": "def solve_31(arr):\n    # Write your code here\n    pass\n\n# Test\nprint(solve_31([1, 2, 31]))",
    "difficulty": "Easy"
  },
  {
    "id": 32,
    "title": "Problem 32: Algorithmic Challenge",
    "description": "Write a Python function solve_32(arr) that processes an array efficiently in O(n) time.",
    "example": "Input: [1, 2, 32]\nOutput: [32, 2, 1]",
    "defaultCode": "def solve_32(arr):\n    # Write your code here\n    pass\n\n# Test\nprint(solve_32([1, 2, 32]))",
    "difficulty": "Medium"
  },
  {
    "id": 33,
    "title": "Problem 33: Algorithmic Challenge",
    "description": "Write a Python function solve_33(arr) that processes an array efficiently in O(n) time.",
    "example": "Input: [1, 2, 33]\nOutput: [33, 2, 1]",
    "defaultCode": "def solve_33(arr):\n    # Write your code here\n    pass\n\n# Test\nprint(solve_33([1, 2, 33]))",
    "difficulty": "Easy"
  },
  {
    "id": 34,
    "title": "Problem 34: Algorithmic Challenge",
    "description": "Write a Python function solve_34(arr) that processes an array efficiently in O(n) time.",
    "example": "Input: [1, 2, 34]\nOutput: [34, 2, 1]",
    "defaultCode": "def solve_34(arr):\n    # Write your code here\n    pass\n\n# Test\nprint(solve_34([1, 2, 34]))",
    "difficulty": "Medium"
  },
  {
    "id": 35,
    "title": "Problem 35: Algorithmic Challenge",
    "description": "Write a Python function solve_35(arr) that processes an array efficiently in O(n) time.",
    "example": "Input: [1, 2, 35]\nOutput: [35, 2, 1]",
    "defaultCode": "def solve_35(arr):\n    # Write your code here\n    pass\n\n# Test\nprint(solve_35([1, 2, 35]))",
    "difficulty": "Easy"
  },
  {
    "id": 36,
    "title": "Problem 36: Algorithmic Challenge",
    "description": "Write a Python function solve_36(arr) that processes an array efficiently in O(n) time.",
    "example": "Input: [1, 2, 36]\nOutput: [36, 2, 1]",
    "defaultCode": "def solve_36(arr):\n    # Write your code here\n    pass\n\n# Test\nprint(solve_36([1, 2, 36]))",
    "difficulty": "Medium"
  },
  {
    "id": 37,
    "title": "Problem 37: Algorithmic Challenge",
    "description": "Write a Python function solve_37(arr) that processes an array efficiently in O(n) time.",
    "example": "Input: [1, 2, 37]\nOutput: [37, 2, 1]",
    "defaultCode": "def solve_37(arr):\n    # Write your code here\n    pass\n\n# Test\nprint(solve_37([1, 2, 37]))",
    "difficulty": "Easy"
  },
  {
    "id": 38,
    "title": "Problem 38: Algorithmic Challenge",
    "description": "Write a Python function solve_38(arr) that processes an array efficiently in O(n) time.",
    "example": "Input: [1, 2, 38]\nOutput: [38, 2, 1]",
    "defaultCode": "def solve_38(arr):\n    # Write your code here\n    pass\n\n# Test\nprint(solve_38([1, 2, 38]))",
    "difficulty": "Medium"
  },
  {
    "id": 39,
    "title": "Problem 39: Algorithmic Challenge",
    "description": "Write a Python function solve_39(arr) that processes an array efficiently in O(n) time.",
    "example": "Input: [1, 2, 39]\nOutput: [39, 2, 1]",
    "defaultCode": "def solve_39(arr):\n    # Write your code here\n    pass\n\n# Test\nprint(solve_39([1, 2, 39]))",
    "difficulty": "Easy"
  },
  {
    "id": 40,
    "title": "Problem 40: Algorithmic Challenge",
    "description": "Write a Python function solve_40(arr) that processes an array efficiently in O(n) time.",
    "example": "Input: [1, 2, 40]\nOutput: [40, 2, 1]",
    "defaultCode": "def solve_40(arr):\n    # Write your code here\n    pass\n\n# Test\nprint(solve_40([1, 2, 40]))",
    "difficulty": "Medium"
  },
  {
    "id": 41,
    "title": "Problem 41: Algorithmic Challenge",
    "description": "Write a Python function solve_41(arr) that processes an array efficiently in O(n) time.",
    "example": "Input: [1, 2, 41]\nOutput: [41, 2, 1]",
    "defaultCode": "def solve_41(arr):\n    # Write your code here\n    pass\n\n# Test\nprint(solve_41([1, 2, 41]))",
    "difficulty": "Easy"
  },
  {
    "id": 42,
    "title": "Problem 42: Algorithmic Challenge",
    "description": "Write a Python function solve_42(arr) that processes an array efficiently in O(n) time.",
    "example": "Input: [1, 2, 42]\nOutput: [42, 2, 1]",
    "defaultCode": "def solve_42(arr):\n    # Write your code here\n    pass\n\n# Test\nprint(solve_42([1, 2, 42]))",
    "difficulty": "Medium"
  },
  {
    "id": 43,
    "title": "Problem 43: Algorithmic Challenge",
    "description": "Write a Python function solve_43(arr) that processes an array efficiently in O(n) time.",
    "example": "Input: [1, 2, 43]\nOutput: [43, 2, 1]",
    "defaultCode": "def solve_43(arr):\n    # Write your code here\n    pass\n\n# Test\nprint(solve_43([1, 2, 43]))",
    "difficulty": "Easy"
  },
  {
    "id": 44,
    "title": "Problem 44: Algorithmic Challenge",
    "description": "Write a Python function solve_44(arr) that processes an array efficiently in O(n) time.",
    "example": "Input: [1, 2, 44]\nOutput: [44, 2, 1]",
    "defaultCode": "def solve_44(arr):\n    # Write your code here\n    pass\n\n# Test\nprint(solve_44([1, 2, 44]))",
    "difficulty": "Medium"
  },
  {
    "id": 45,
    "title": "Problem 45: Algorithmic Challenge",
    "description": "Write a Python function solve_45(arr) that processes an array efficiently in O(n) time.",
    "example": "Input: [1, 2, 45]\nOutput: [45, 2, 1]",
    "defaultCode": "def solve_45(arr):\n    # Write your code here\n    pass\n\n# Test\nprint(solve_45([1, 2, 45]))",
    "difficulty": "Easy"
  },
  {
    "id": 46,
    "title": "Problem 46: Algorithmic Challenge",
    "description": "Write a Python function solve_46(arr) that processes an array efficiently in O(n) time.",
    "example": "Input: [1, 2, 46]\nOutput: [46, 2, 1]",
    "defaultCode": "def solve_46(arr):\n    # Write your code here\n    pass\n\n# Test\nprint(solve_46([1, 2, 46]))",
    "difficulty": "Medium"
  },
  {
    "id": 47,
    "title": "Problem 47: Algorithmic Challenge",
    "description": "Write a Python function solve_47(arr) that processes an array efficiently in O(n) time.",
    "example": "Input: [1, 2, 47]\nOutput: [47, 2, 1]",
    "defaultCode": "def solve_47(arr):\n    # Write your code here\n    pass\n\n# Test\nprint(solve_47([1, 2, 47]))",
    "difficulty": "Easy"
  },
  {
    "id": 48,
    "title": "Problem 48: Algorithmic Challenge",
    "description": "Write a Python function solve_48(arr) that processes an array efficiently in O(n) time.",
    "example": "Input: [1, 2, 48]\nOutput: [48, 2, 1]",
    "defaultCode": "def solve_48(arr):\n    # Write your code here\n    pass\n\n# Test\nprint(solve_48([1, 2, 48]))",
    "difficulty": "Medium"
  },
  {
    "id": 49,
    "title": "Problem 49: Algorithmic Challenge",
    "description": "Write a Python function solve_49(arr) that processes an array efficiently in O(n) time.",
    "example": "Input: [1, 2, 49]\nOutput: [49, 2, 1]",
    "defaultCode": "def solve_49(arr):\n    # Write your code here\n    pass\n\n# Test\nprint(solve_49([1, 2, 49]))",
    "difficulty": "Easy"
  },
  {
    "id": 50,
    "title": "Problem 50: Algorithmic Challenge",
    "description": "Write a Python function solve_50(arr) that processes an array efficiently in O(n) time.",
    "example": "Input: [1, 2, 50]\nOutput: [50, 2, 1]",
    "defaultCode": "def solve_50(arr):\n    # Write your code here\n    pass\n\n# Test\nprint(solve_50([1, 2, 50]))",
    "difficulty": "Medium"
  }
];
