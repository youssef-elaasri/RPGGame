def convert_to_float(strings):
    """
    Converts a list of string representations of numbers to floats. Non-convertible strings become None.

    Parameters:
    strings (list of str): List containing string representations of numbers.

    Returns:
    list: New list with each string converted to float or None if conversion fails.
    """
    result = []
    for item in strings:
        try:
            # Attempt to convert string to float
            result.append(float(item))
        except ValueError:
            # Append None if conversion fails
            result.append(None)
    
    return result