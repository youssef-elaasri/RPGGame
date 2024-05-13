import unittest
import random
import string
from convert_to_float_suggested import convert_to_float
import timeout_decorator


def convert_to_float_solution(strings):
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

class TestConvertToFloat(unittest.TestCase) :
    
    @timeout_decorator.timeout(10)
    def test_1(self):
        for _ in range(1,100):
            l = []
            length = random.randint(1,100)
            for _ in range(length):
                is_it_float = random.randint(0,1)
                if (is_it_float == 0):
                    l.append(str(random.random())) 
                else:
                    string_length = random.randint(1,10)
                    l.append(''.join(random.choice(string.ascii_letters + string.digits) for _ in range(string_length)))
            self.assertEqual(convert_to_float(l),convert_to_float_solution(l))
            
if __name__ == '__main__':
    unittest.main()
