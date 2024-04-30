def tri_batiments(batiments):
    """
    Sorts buildings based on the importance-to-energy consumption ratio.

    Parameters:
    batiments (list of tuples): Each tuple contains (energy_consumption, importance)

    Returns:
    list: Sorted list of buildings with the highest importance-to-energy ratio first.
    """