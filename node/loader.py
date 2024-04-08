import sys
import os

def main():
    if len(sys.argv) != 2:
        print("Usage: python loader.py <script_name>")
        sys.exit(1)

    script_name = sys.argv[1]
    script_path = os.path.join("python_scripts", script_name + ".py")

    if not os.path.exists(script_path):
        print(f"Error: Script '{script_name}' not found")
        sys.exit(1)

    # Run the test script and capture the return code
    return_code = os.system(f"python python_scripts/{script_name}_tester.py")

    # Exit with return code 1 if the test script failed (non-zero return code)
    if return_code != 0:
        sys.exit(1)

if __name__ == "__main__":
    main()

