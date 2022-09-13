import { useEffect, useRef, useState } from "react";
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

const AllArea = styled.div`
  position: absolute;
  top: 100px;
  left: 100px;
  display: flex;
  flex-direction: column;
`;
const SingleArea = styled.div`
  cursor: pointer;
  &:hover {
    background-color: #000;
    color: #fff;
  }
`;

const PhoneLink = styled.a``;

type ClinicType = {
  name: string;
  location: string;
  country: string;
  phone: string;
  note: string;
};

const VetClinic = () => {
  const clinicRef = useRef<ClinicType[]>([]);
  const [clinics, setClinics] = useState<ClinicType[]>([]);
  const areaList = ["all", "北部地區", "中部地區", "南部地區"];
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
    clinicRef.current = allClinic;
    setClinics(allClinic);
  }

  function changePreferenceArea(target: string) {
    const displayClinic: ClinicType[] = [];
    clinicRef.current.forEach((clinic) => {
      if (
        target === "北部地區" &&
        [
          "臺北市",
          "新北市",
          "桃園市",
          "新竹市",
          " 臺北市",
          " 新北市",
          " 桃園市",
          " 新竹市",
        ].indexOf(clinic.country) > -1
      ) {
        displayClinic.push(clinic);
      } else if (
        target === "中部地區" &&
        [
          "臺中市",
          "苗栗縣",
          "彰化縣",
          "南投縣",
          "雲林縣",
          " 臺中市",
          " 苗栗縣",
          " 彰化縣",
          " 南投縣",
          " 雲林縣",
        ].indexOf(clinic.country) > -1
      ) {
        displayClinic.push(clinic);
      } else if (
        target === "南部地區" &&
        [
          "高雄市",
          "臺南市",
          "嘉義市",
          "嘉義縣",
          "屏東縣",
          " 高雄市",
          " 臺南市",
          " 嘉義市",
          " 嘉義縣",
          " 屏東縣",
        ].indexOf(clinic.country) > -1
      ) {
        displayClinic.push(clinic);
      } else if (target === "all") {
        displayClinic.push(clinic);
      }
    });
    setClinics(displayClinic);
  }

  return (
    <>
      <AllArea>
        {areaList.map((area, index) => (
          <SingleArea
            key={index}
            onClick={(e) => {
              const target = e.target as HTMLElement;
              changePreferenceArea(target.innerText);
            }}
          >
            {area}
          </SingleArea>
        ))}
      </AllArea>
      <ClinicListContainer>
        {clinics.map((clinic, index) => (
          <ClinicCard key={index}>
            <ClinicTitle>{clinic.name}</ClinicTitle>
            <ClinicInfo>{clinic.country}</ClinicInfo>
            <ClinicInfo>
              <PhoneLink href={`tel:${clinic.phone}`}>{clinic.phone}</PhoneLink>
            </ClinicInfo>
            <ClinicInfo>{clinic.location}</ClinicInfo>
            <ClinicInfo>{clinic.note}</ClinicInfo>
          </ClinicCard>
        ))}
      </ClinicListContainer>
    </>
  );
};

export default VetClinic;
