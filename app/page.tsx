import PatientForm from "@/components/forms/PatientForm";
import { API_KEY, ENDPOINT, PROJECT_ID } from "@/lib/appwrite.config";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
          <Image
            alt="patient"
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            className="mb-12 h-10 w-fit"
          ></Image>

          <PatientForm></PatientForm>

          <div className="flex flex-col">
            <h3>Public variable: {ENDPOINT!}</h3>
            <h3>Public variable: {PROJECT_ID}</h3>
            <h3>Public variable: {API_KEY!}</h3>
          </div>

          <div className="text-14-regular mt-20 flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left">
              ©2024 CarePulse
            </p>
            <Link href="/?admin=true" className="text-green-500">
              Admin
            </Link>
          </div>
        </div>
      </section>

      <Image
        src="/assets/images/onboarding-img.png"
        height={1000}
        width={1000}
        alt="doctor"
        className="side-img max-w-[50%]"
      ></Image>
    </div>
  );
}
