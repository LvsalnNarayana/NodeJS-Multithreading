import json
import sys


def calculate_sum(input_value):
    try:
        # Convert and validate input
        n = int(input_value)
        if n <= 0:
            raise ValueError("Input must be a positive integer greater than zero")

        # Calculate sum using arithmetic progression formula
        total = (n - 1) * n // 2

        return total

    except ValueError as e:
        error_msg = f"Invalid input: {str(e)}"
        response = json.dumps({"status": "error", "message": error_msg})
        sys.stderr.write(response)
        sys.exit(1)
    except Exception as e:
        response = json.dumps({"status": "error", "message": str(e)})
        sys.stderr.write(response)
        sys.exit(1)


if __name__ == "__main__":
    try:
        # Get input from command line arguments
        if len(sys.argv) < 2:
            raise ValueError(
                "Missing required argument. Usage: python script.py <number>"
            )

        input_value = sys.argv[1]
        total = calculate_sum(input_value)
        # Write result to stdout
        sys.stdout.write(str(total))

    except Exception as e:
        error_response = json.dumps(
            {"status": "error", "message": f"Input processing failed: {str(e)}"}
        )
        sys.stderr.write(error_response)
        sys.exit(1)
