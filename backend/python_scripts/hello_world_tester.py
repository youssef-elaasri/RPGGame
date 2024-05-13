import sys
import hello_world_suggested
import timeout_decorator


@timeout_decorator.timeout(10)
def test_return_hello_world():
    result = hello_world_suggested.return_hello_world()
    expected_result = "Hello, World!"
    
    if result != expected_result:
        print(f"Test failed: Expected '{expected_result}', but got '{result}'")
        sys.exit(1)

if __name__ == "__main__":
    test_return_hello_world()
    print("All tests passed successfully.")