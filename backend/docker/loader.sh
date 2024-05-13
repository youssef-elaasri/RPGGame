#!/bin/bash

# Check if three arguments are provided
if [ "$#" -ne 3 ]; then
    echo "Usage: $0 <file1> <file2> <content>"
    exit 1
fi

# Assign arguments to variables
file1="$1"
file2="$2"
content="$3"

# Source and destination directories
source_dir="./python_scripts/"
destination_dir="./exec/"

# Check if source files exist
if [ ! -f "$source_dir/$file1" ]; then
    echo "Error: $file1 does not exist in $source_dir."
    exit 1
fi

# Copy file1 to destination directory
cp "$source_dir/$file1" "$destination_dir/"
cp_exit_code=$?
if [ $cp_exit_code -ne 0 ]; then
    echo "Error: Failed to copy $file1 to $destination_dir."
    exit 1
fi

# Create new file in destination directory with content
echo "$content" > "$destination_dir/$file2"
create_exit_code=$?
if [ $create_exit_code -ne 0 ]; then
    echo "Error: Failed to create $file2 in $destination_dir."
    exit 1
fi

# Change directory to destination directory
cd "$destination_dir" || exit

# Execute Python script and capture exit code
python3 "$file1"
python_exit_code=$?

# Return the exit code of the Python script
exit $python_exit_code
