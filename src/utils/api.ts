const api = {
  async getAnimalAPI() {
    const res = await fetch('https://data.coa.gov.tw/api/v1/AnimalRecognition')
    return await res.json()
  },
  async getAnimapAPIWithAreaAndKind(area: string, kind: string) {
    const res = await fetch(
      `https://data.coa.gov.tw/api/v1/AnimalRecognition/?animal_area_pkid=${area}&animal_kind=${kind}`,
    )
    return await res.json()
  },
  async getAnimapAPIWithKind(kind: string) {
    const res = await fetch(
      `https://data.coa.gov.tw/api/v1/AnimalRecognition/?animal_kind=${kind}`,
    )
    return await res.json()
  },
  async getAnimapAPIWithArea(area: string) {
    const res = await fetch(
      `https://data.coa.gov.tw/api/v1/AnimalRecognition/?animal_area_pkid=${area}`,
    )
    return await res.json()
  },
}

export default api
