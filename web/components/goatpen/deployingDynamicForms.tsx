"use client";
import React, { useState } from "react";
import { EyeClose, EyeOpen } from "../shared/icons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./dialogBox";

interface FormField {
  type: string;
  label: string;
  key: string;
  options?: string[];
  linked_input?: Record<string, FormField[]>;
  required?: boolean;
}

const DynamicForm = ({
  formData,
  configFile,
  goatType,
  goatBucketName,
  goatModuleUrlName,
  targetEndpoint,
  cardTitle,
}: {
  formData: FormField[];
  configFile: string;
  goatType: string;
  goatBucketName: string;
  goatModuleUrlName: string;
  targetEndpoint: Array<string>;
  cardTitle: string;
}) => {
  const [selectedValues, setSelectedValues] = useState<Record<string, string>>(
    {},
  );
  const [passwordVisibility, setPasswordVisibility] = useState<
    Record<string, boolean>
  >({});
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({}); // New state for validation errors
  const [isClicked, setIsClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [buildId, setBuildId] = useState("");

  const handleInputChange = (key: string, value: string) => {
    setSelectedValues((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
    // Remove error message as user starts typing
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [key]: "",
    }));
  };

  const togglePasswordVisibility = (key: string) => {
    setPasswordVisibility((prevVisibility) => ({
      ...prevVisibility,
      [key]: !prevVisibility[key],
    }));
  };

  // Validate the form and return errors for fields that are required but not filled
  const validateForm = (): Record<string, string> => {
    const errors: Record<string, string> = {};

    formData.forEach((field) => {
      if (field.required && !selectedValues[field.key]) {
        errors[field.key] = `${field.label} is required.`;
      }

      if (field.type === "linked_dropdown" && selectedValues[field.key]) {
        const linkedFields = field.linked_input?.[selectedValues[field.key]];
        if (Array.isArray(linkedFields)) {
          linkedFields.forEach((linkedField) => {
            if (linkedField.required && !selectedValues[linkedField.key]) {
              errors[linkedField.key] = `${linkedField.label} is required.`;
            }
          });
        }
      }
    });

    return errors;
  };

  // Handle form submission
  const handleSubmit = async () => {
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
    } else {
      try {
        const response = await fetch("/api/goat-pen/trigger", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...selectedValues,
            configPath: configFile,
            targetEndpoint: targetEndpoint,
            cardTitle: cardTitle,
            _TERRAFORM_DIRECTORY: goatBucketName || "",
            _MODULE_URL_NAME: goatModuleUrlName || "",
          }),
        });

        const result = await response.json();

        if (response.ok) {
          if (result.url) {
            if (result.url === "destroy") {
              setUrl("destroy");
            } else if (result.url === "failed") {
              setUrl("failed");
            } else if (result.url === "cancelled") {
              setUrl("cancelled");
            } else if (result.url === "unknown") {
              setUrl("unknown");
              setBuildId(result.buildId || "");
            } else {
              setUrl(result.url);
            }
          } else {
            setUrl("");
          }
        } else {
          alert(`Error: ${result.error}`);
        }
      } catch (error) {
        console.log(error);
        alert("Failed to submit build");
      }
    }
  };

  const renderField = (field: FormField) => {
    const errorMessage = validationErrors[field.key];

    switch (field.type) {
      case "input":
        return (
          <div key={field.key} className="mb-4">
            <label className="my-3 block text-base font-medium text-gray-700">
              {field.label}{" "}
              {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              className={`h-[45px] w-full rounded-[10px] border-2 border-transparent bg-gray-100 px-[1rem] leading-[30px] text-gray-900 outline-none transition-all duration-500 ease-in-out hover:border-indigo-300 hover:bg-white focus:border-indigo-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-300/30 ${
                errorMessage ? "border-red-500" : "border-gray-300"
              }`}
              placeholder={field.label}
              value={selectedValues[field.key] || ""}
              onChange={(e) => handleInputChange(field.key, e.target.value)}
            />
            {errorMessage && (
              <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
            )}
          </div>
        );
      case "password":
        return (
          <div key={field.key} className="relative mb-4">
            <label className="my-3 block text-base font-medium text-gray-700">
              {field.label}{" "}
              {field.required && <span className="text-red-500">*</span>}
            </label>
            <div className="flex items-center">
              <div className="absolute left-4 h-4 w-4 fill-none">
                <svg
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon"
                >
                  <path d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"></path>
                </svg>
              </div>
              <input
                type={passwordVisibility[field.key] ? "text" : "password"}
                className={`h-[45px] w-full rounded-[10px] border-2 border-transparent bg-gray-100 px-11 leading-[30px] text-gray-900 outline-none transition-all duration-500 ease-in-out hover:border-indigo-300 hover:bg-white focus:border-indigo-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-300/30 ${
                  errorMessage ? "border-red-500" : "border-gray-300"
                }`}
                placeholder={field.label}
                value={selectedValues[field.key] || ""}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
                autoComplete="off"
              />
              <button
                onClick={() => togglePasswordVisibility(field.key)}
                className="absolute right-5 scale-[1.3] transform"
              >
                {passwordVisibility[field.key] ? <EyeOpen /> : <EyeClose />}
              </button>
            </div>
            {errorMessage && (
              <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
            )}
          </div>
        );
      case "dropdown":
        return (
          <div key={field.key} className="mb-4">
            <label className="my-3 block text-base font-medium text-gray-700">
              {field.label}{" "}
              {field.required && <span className="text-red-500">*</span>}
            </label>
            <div className="after:font-3 relative after:absolute after:right-4 after:top-2.5 after:scale-[0.85] after:content-['▼']">
              <select
                className={`input w-full appearance-none rounded rounded-[10px] border border-2 border-transparent bg-gray-100 p-2 px-3 text-gray-900 transition-all duration-500 ease-in-out hover:border-indigo-300 hover:bg-white focus:border-indigo-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-300/30 ${
                  errorMessage ? "border-red-500" : "border-gray-300"
                }`}
                value={selectedValues[field.key] || ""}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
              >
                <option value="">Select an option</option>
                {field.options?.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            {errorMessage && (
              <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
            )}
          </div>
        );
      case "linked_dropdown":
        return (
          <div key={field.key} className="mb-4">
            <label className="my-3 block text-base font-medium text-gray-700">
              {field.label}{" "}
              {field.required && <span className="text-red-500">*</span>}
            </label>
            <div className="after:font-3 relative after:absolute after:right-4 after:top-2.5 after:scale-[0.85] after:content-['▼']">
              <select
                className={`input w-full appearance-none rounded rounded-[10px] border border-2 border-transparent bg-gray-100 p-2 px-3 text-gray-900 transition-all duration-500 ease-in-out hover:border-indigo-300 hover:bg-white focus:border-indigo-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-300/30 ${
                  errorMessage ? "border-red-500" : "border-gray-300"
                }`}
                value={selectedValues[field.key] || ""}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
              >
                <option value="">Select an option</option>
                {field.options?.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {errorMessage && (
              <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
            )}

            {selectedValues[field.key] &&
              Array.isArray(field.linked_input?.[selectedValues[field.key]]) &&
              field.linked_input &&
              field.linked_input[selectedValues[field.key]].map(
                (linkedField, index) => (
                  <div key={index} className="mt-4 pl-4">
                    {renderField(linkedField)}
                  </div>
                ),
              )}
          </div>
        );
      default:
        return null;
    }
  };

  const handleClick = async () => {
    setIsLoading(true); // Start loading
    setIsClicked(true); // Update clicked state (if needed)

    try {
      await handleSubmit();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false); // Stop loading
      setIsClicked(false);
    }
  };

  return (
    <div className="space-y-4">
      {formData.map((field) => renderField(field))}

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <div className="flex justify-end">
            <button
              type="button"
              className={`
        relative z-10 m-5 inline-block h-12 w-24 scale-[0.85] cursor-pointer overflow-hidden rounded-xl
        border-2 border-blue-500 bg-white bg-opacity-70 text-lg font-bold leading-10 text-blue-500
        before:absolute before:left-full before:top-full before:z-[-1] before:h-[200px] before:w-[150px]
        before:rounded-full before:transition-all before:duration-300 before:content-['']
        hover:text-white hover:before:left-[-30px] hover:before:top-[-30px]
        ${
          isClicked
            ? "border-blue-600 before:bg-blue-600"
            : "before:bg-blue-500"
        }
        ${isLoading ? "cursor-not-allowed opacity-70" : ""}
      `}
              onClick={isLoading ? () => {} : handleClick} // Prevent multiple clicks
              disabled={isLoading} // Disable button while loading
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="h-5 w-5 animate-spin text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                </div>
              ) : (
                "Done"
              )}
            </button>
          </div>
        </AlertDialogTrigger>
        <>
          {url && url !== "" && (
            <AlertDialogContent>
              <AlertDialogHeader>
                {(url === "destroy" && (
                  <AlertDialogTitle>
                    Successfully Destroyed {cardTitle}
                  </AlertDialogTitle>
                )) ||
                  (url === "failed" && (
                    <AlertDialogTitle>
                      Failed to Deploy {cardTitle}
                    </AlertDialogTitle>
                  )) ||
                  (url === "cancelled" && (
                    <AlertDialogTitle>
                      Cancelled the Deploy {cardTitle}
                    </AlertDialogTitle>
                  )) ||
                  (url === "unknown" && (
                    <AlertDialogTitle>
                      Deployment failed for unknown reason {cardTitle}
                    </AlertDialogTitle>
                  )) || (
                    <AlertDialogTitle>
                      Successfully Deployed {cardTitle}
                    </AlertDialogTitle>
                  )}

                {(url === "destroy" && (
                  <AlertDialogDescription>
                    The {cardTitle} has been successfully destroyed.
                  </AlertDialogDescription>
                )) ||
                  (url === "failed" && (
                    <AlertDialogDescription>
                      The {cardTitle} has failed to deploy.
                    </AlertDialogDescription>
                  )) ||
                  (url === "cancelled" && (
                    <AlertDialogDescription>
                      The {cardTitle} deployment has been cancelled.
                    </AlertDialogDescription>
                  )) ||
                  (url === "unknown" && (
                    <AlertDialogDescription>
                      The {cardTitle} deployment failed for unknown reason.
                      Refer the build ID: {buildId}
                    </AlertDialogDescription>
                  )) || (
                    <AlertDialogDescription>
                      The URL is {url}
                    </AlertDialogDescription>
                  )}
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction onClick={() => setUrl("")}>
                  Done
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          )}
        </>
      </AlertDialog>
    </div>
  );
};

export default DynamicForm;
