def convert_to_float(strings):
    """
    Converts a list of string representations of numbers to floats. Non-convertible strings become None.

    Parameters:
    strings (list of str): List containing string representations of numbers.

    Returns:
    list: New list with each string converted to float or None if conversion fails.
    """
    l = []
    for elem in strings:
        try:
            f = float(elem)
            l.append(f)
        except:
            l.append(None)
    return l