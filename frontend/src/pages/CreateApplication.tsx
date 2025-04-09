import React from "react";
import ApplicationForm from "../components/ApplicationForm";

const CreateApplication = () => {
  return (
    <>
      <h1 className="text-3xl font-bold text-center my-6">
        New Job Application
      </h1>
      <ApplicationForm />
    </>
  );
};

export default CreateApplication;
