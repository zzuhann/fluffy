import { useEffect, useState } from "react";
import { db } from "../../utils/firebase";
import { collection, getDocs } from "firebase/firestore";
import styled from "styled-components";

const ClinicListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 600px;
  position: relative;
  left: 50%;
  top: 50px;
  transform: translate(-50%);
`;

const ClinicCard = styled.div`
  width: 180px;
  height: 180px;
  margin-bottom: 25px;
`;

const ClinicTitle = styled.div``;
const ClinicInfo = styled.div``;

const VetClinic = () => {
  const [clinics, setClinics] = useState<
    {
      name: string;
      location: string;
      country: string;
      phone: string;
      note: string;
    }[]
  >([]);
  useEffect(() => {
    getVetClinicData();
  }, []);

  async function getVetClinicData() {
    const allClinic: {
      name: string;
      location: string;
      country: string;
      phone: string;
      note: string;
    }[] = [];
    const p = collection(db, "24HoursVetClinics");
    const querySecond = await getDocs(p);
    querySecond.forEach((info) => {
      allClinic.push(
        info.data() as {
          name: string;
          location: string;
          country: string;
          phone: string;
          note: string;
        }
      );
    });
    setClinics(allClinic);
  }
  return (
    <ClinicListContainer>
      {clinics.map((clinic) => (
        <ClinicCard>
          <ClinicTitle>{clinic.name}</ClinicTitle>
          <ClinicInfo>{clinic.country}</ClinicInfo>
          <ClinicInfo>{clinic.phone}</ClinicInfo>
          <ClinicInfo>{clinic.location}</ClinicInfo>
          <ClinicInfo>{clinic.note}</ClinicInfo>
        </ClinicCard>
      ))}
    </ClinicListContainer>
  );
};

export default VetClinic;
