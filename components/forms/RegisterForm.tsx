"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { PatientFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { createUser, registerPatient } from "@/lib/actions/patient.actions";
import { FormFieldType } from "./PatientForm";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Doctors,
  GenderOptions,
  IdentificationTypes,
  PatientFormDefaultValues,
} from "@/constants";
import { Label } from "../ui/label";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import FileUploader from "../FileUploader";

const RegisterForm = ({ user }: { user: User }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
    setIsLoading(true);

    let formData;

    if (
      values.identificationDocument &&
      values.identificationDocument.length > 0
    ) {
      const blobFile = new Blob([values.identificationDocument[0]], {
        type: values.identificationDocument[0].type,
      });

      formData = new FormData();
      formData.append("blobFile", blobFile);
      formData.append("fileName", values.identificationDocument[0].name);
    }

    try {
      const patientData = {
        ...values,
        userId: user.$id,
        birthDate: new Date(values.birthDate), // JavaScript Date object provide method like getFullYear(), getMonth(), etc., which are useful for data manipulation,
        identificationDocument: formData,
      };

      // @ts-ignore
      const patient = await registerPatient(patientData);

      if (patient) {
        router.push(`/patients/${patient.$id}/new-appointment`);
      }
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-12 flex-1"
      >
        <section className="space-y-4">
          <h1 className="header">Welcome 💊</h1>
          <p className="text-dark-700">Let us know more about yourself.</p>
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Personal Information</h2>
          </div>

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="name"
            label="Full name"
            placeholder="Anatha Smith"
            iconSrc="/assets/icons/user.svg"
            iconAlt="user"
          />

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="email"
              label="Email"
              placeholder="anathasmith@gmail.com"
              iconSrc="/assets/icons/email.svg"
              iconAlt="email"
            />

            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.PHONE_INPUT}
              name="phone"
              label="Phone number"
              placeholder="(604) - 728 - 3489"
            />
          </div>

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.DATE_PICKER}
              name="birthDate"
              label="Date of birth"
            />

            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.SKELETON}
              name="gender"
              label="Gender"
              renderSkeleton={(field) => (
                <FormControl>
                  <RadioGroup
                    className="flex h-11 gap-6 xl:justify-between"
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    {GenderOptions.map((option, i) => (
                      <div key={option + i} className="radio-group">
                        <RadioGroupItem value={option} id={option} />
                        <Label htmlFor={option} className="cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
              )}
            />
          </div>

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="address"
              label="Address"
              placeholder="456 Burney Road"
            />

            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="occupation"
              label="Occupation"
              placeholder="Data Analyst"
            />
          </div>
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="emergencyContactName"
              label="Emergency contact name"
              placeholder="Guardian’s name"
            />

            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.PHONE_INPUT}
              name="emergencyContactNumber"
              label="Emergency Contact number"
              placeholder="(604) - 728 - 3489"
            />
          </div>
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Medical Information</h2>
          </div>

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.SELECT}
            name="primaryPhysician"
            label="Primary Physician"
            placeholder="Select a Physician"
          >
            {Doctors.map((doctor) => (
              <SelectItem key={doctor.name} value={doctor.name}>
                <div className="flex cursor-pointer items-center gap-2">
                  <Image
                    src={doctor.image}
                    width={32}
                    height={32}
                    alt={doctor.name}
                    //   className="border border-dark-500"
                  ></Image>
                  <p>{doctor.name}</p>
                </div>
              </SelectItem>
            ))}
          </CustomFormField>

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="insuranceProvider"
              label="Insurance Provider"
              placeholder="Red Shield Insurance"
            />

            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="insurancePolicyNumber"
              label="Insurance Policy Number"
              placeholder="AFC123456"
            />
          </div>

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.TEXTAREA}
              name="allergies"
              label="Allergies (if any)"
              placeholder="ex: Peanuts, Penicillin, Pollen"
            />

            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.TEXTAREA}
              name="currentMedications"
              label="Current medications"
              placeholder="ex: Ibuprofen 200mg, Levothyroxine 50mcg"
            />
          </div>
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="familyMedicalHistory"
              label=" Family medical history (if relevant)"
              placeholder="Mother had brain cancer, Father has hypertension"
            />

            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="pastMedicalHistory"
              label="Past medical history"
              placeholder="Appendectomy in 2015, Asthma diagnosis in childhood"
            />
          </div>
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Identification and Verfication</h2>
          </div>

          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="identificationType"
            label="Identification Type"
            placeholder="Select identification type"
          >
            {IdentificationTypes.map((type, i) => (
              <SelectItem key={type + i} value={type}>
                {type}
              </SelectItem>
            ))}
          </CustomFormField>

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="identificationNumber"
            label="Identification Number"
            placeholder="123456789"
          />

          <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="identificationDocument"
            label="Scanned Copy of Identification Document"
            renderSkeleton={(field) => (
              <FormControl>
                <FileUploader files={field.value} onChange={field.onChange} />
              </FormControl>
            )}
          />
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Consent and Privacy</h2>
          </div>

          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="treatmentConsent"
            label="I consent to receive treatment for my health condition."
          />
          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="disclosureConsent"
            label="I consent to the use and disclosure of my health
            information for treatment purposes."
          />

          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="privacyConsent"
            label="I acknowledge that I have reviewed and agree to the
            privacy policy"
          />
        </section>

        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  );
};

export default RegisterForm;