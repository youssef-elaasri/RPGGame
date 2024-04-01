import sys
import os

def main():
    print("Received arguments:", sys.argv)
    if len(sys.argv) != 2:
        print("Usage: python loader.py <script_name>")
        sys.exit(1)

    script_name = sys.argv[1]
    script_path = os.path.join("python_scripts", script_name)

    if not os.path.exists(script_path):
        print(f"Error: Script '{script_name}' not found")
        sys.exit(1)

    os.system(f"python python_scripts/{script_name}")

if __name__ == "__main__":
    main()
