#!/bin/bash

# Check if two arguments are provided
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <file1> <file2>"
    exit 1
fi

# Assign arguments to variables
file1="$1"
file2="$2"

# Source and destination directories
source_dir="./python_scripts/"
destination_dir="./exec/"

# Check if source files exist
if [ ! -f "$source_dir/$file1" ]; then
    echo "Error: $file1 does not exist in $source_dir."
    exit 1
fi

if [ ! -f "$source_dir/$file2" ]; then
    echo "Error: $file2 does not exist in $source_dir."
    exit 1
fi

# Copy file1 to destination directory
cp "$source_dir/$file1" "$destination_dir/"

# Move file2 to destination directory
mv "$source_dir/$file2" "$destination_dir/"

# Change directory to destination directory
cd "$destination_dir" || exit

# Execute Python script and capture exit code
python3 "$file1"
python_exit_code=$?

# Return the exit code of the Python script
exit $python_exit_code
