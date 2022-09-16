import { useEffect, useRef, useState } from "react";
import { db } from "../../utils/firebase";
import { collection, getDocs } from "firebase/firestore";
import styled from "styled-components";

const Wrap = styled.div`
  width: 100%;
  min-height: 100vh;
  height: 100%;
  background-color: #fafafa;
  position: relative;
`;

const ClinicListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 800px;
  position: relative;
  margin: 0 auto;
  padding-top: 150px;
  padding-bottom: 80px;
`;

const ClinicCard = styled.div`
  margin-bottom: 25px;
  width: calc((100% - 20px) / 2);
  flex-shrink: 0;
  border: solid 2px #d1cfcf;
  border-radius: 5px;
  margin-right: 15px;
  padding: 20px;
  letter-spacing: 1.5px;
  position: relative;
  &:nth-child(2n) {
    margin-right: 0;
  }
`;

const ClinicLoc = styled.div`
  font-size: 22px;
  font-weight: bold;
  color: #d0470c;
  position: absolute;
  top: 20px;
  right: 20px;
`;

const ClinicTitle = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;
const ClinicInfo = styled.div`
  font-size: 18px;
  margin-bottom: 15px;
  line-height: 25px;
  &:last-child {
    margin-bottom: 0;
  }
`;

const PhoneLink = styled.a``;
const AreaTitle = styled.h1`
  font-size: 32px;
  font-weight: bold;
  position: absolute;
  top: 80px;
  padding-left: 12px;
  &:before {
    content: "";
    width: 4px;
    height: 100%;
    background-color: #d0470c;
    position: absolute;
    left: 0;
  }
`;

const SelectGroup = styled.div`
  position: absolute;
  border: solid 1px black;
  font-size: 22px;
  cursor: pointer;
  transition: 0.3s;
  margin-left: 10px;
  padding: 10px 15px;
  border: solid 3px #d1cfcf;
  border-radius: 5px;
  width: 200px;
  z-index: 1000;
  top: 80px;
  left: 80px;
`;
const NowChooseOption = styled.div`
  &:after {
    content: "ˇ";
    position: absolute;
    right: 10px;
    top: 15px;
  }
`;
const OptionGroup = styled.ul<{ $isActive: boolean }>`
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  height: ${(props) => (props.$isActive ? "auto" : "0px")};
  position: absolute;
  background-color: #fff;
  width: 200px;
  left: 0;
  top: 50px;
`;
const OptionName = styled.li`
  display: flex;
  justify-content: center;
  padding: 8px 10px;
  transition: 0.2s;
  &:hover {
    background-color: #d1cfcf;
    color: #3c3c3c;
  }
`;

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
  const [optionBoxOpen, setOptionBoxOpen] = useState<boolean>(false);
  const [nowCountry, setNowCountry] = useState<string>("全台診所");
  const areaList = ["全台診所", "北部地區", "中部地區", "南部地區"];
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
      } else if (target === "全台診所") {
        displayClinic.push(clinic);
      }
    });
    setClinics(displayClinic);
  }

  return (
    <Wrap>
      <SelectGroup>
        <NowChooseOption
          onMouseEnter={() => {
            setOptionBoxOpen(true);
          }}
        >
          {nowCountry}
        </NowChooseOption>
        <OptionGroup
          $isActive={optionBoxOpen === true}
          onMouseLeave={() => {
            setOptionBoxOpen(false);
          }}
        >
          {areaList.map((area, index) => (
            <OptionName
              key={index}
              value={area}
              onClick={(e) => {
                const target = e.target as HTMLElement;
                changePreferenceArea(target.innerText);
                setNowCountry(target.innerText);
              }}
            >
              {area}
            </OptionName>
          ))}
        </OptionGroup>
      </SelectGroup>

      <ClinicListContainer>
        <AreaTitle>{nowCountry}</AreaTitle>
        {clinics.map((clinic, index) => (
          <ClinicCard key={index}>
            <ClinicTitle>{clinic.name}</ClinicTitle>
            <ClinicLoc>{clinic.country}</ClinicLoc>
            <ClinicInfo>{clinic.location}</ClinicInfo>
            <ClinicInfo>
              <PhoneLink href={`tel:${clinic.phone}`}>{clinic.phone}</PhoneLink>
            </ClinicInfo>
            <ClinicInfo>{clinic.note}</ClinicInfo>
          </ClinicCard>
        ))}
      </ClinicListContainer>
    </Wrap>
  );
};

export default VetClinic;
