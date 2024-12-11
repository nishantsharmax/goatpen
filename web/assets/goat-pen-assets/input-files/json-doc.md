# Type of input supported are:
1. **Normal input text (input)**

2. **Passwd input text (password)**

3. **Dropdown input text (dropdown)**

4. **Dropdown input text but some inputs are linked with it's output (linked_dropdown)**

# Fields are defined as follows:
* **type**: Type of input field **(string)**

* **label**: Label of input field **(string)**

* **key**: unique key the value will be stored in this key itself **(string)**

* **required**: If the field is required or not **(boolean)**

* **options**: Options for dropdown **(list of strings)**

* **linked_input**: Keys of linked fields **(dictionary of dictionaries[])**


# Details of linked_input:
1. the key of the linked_input is the key of the option selected in the dropdown. So, the key should be the same as the options.
2. The value of that key is a dictionary same as the normal input fields. 

# Example:
`example.json`
```json
[
    {
        "type": "input",
        "label": "Enter your name",
        "key": "name",
        "required": true
    },
    {
        "type": "password",
        "label": "Enter your password",
        "key": "password",
        "required": true
    },
    {
        "type": "dropdown",
        "label": "Select your option",
        "key": "option",
        "required": true,
        "options": ["Option 1", "Option 2", "Option 3"]
    },
    {
        "type": "linked_dropdown",
        "label": "Select your option",
        "key": "option",
        "required": true,
        "options": ["Option 1", "Option 2", "Option 3"],
        "linked_input": {
            "Option 1": [
                {
                    "type": "input",
                    "label": "Enter your name",
                    "key": "name",
                    "required": true
                }
            ],
            "Option 2": [
                {
                    "type": "password",
                    "label": "Enter your password",
                    "key": "password",
                    "required": true
                }
            ],
            "Option 3": [
                {
                    "type": "dropdown",
                    "label": "Select your option",
                    "key": "option",
                    "required": true,
                    "options": ["Option 1", "Option 2", "Option 3"]
                }
            ]
        }
    }
]
```