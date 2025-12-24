
/**
 * Simulated API for National Database Integrations
 * In a real-world scenario, these would be calls to UIDAI, CCTNS, and PFMS gateways.
 */

export const verifyAadhaar = async (aadhaar: string) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  // Simple validation: 12 digits
  return /^\d{12}$/.test(aadhaar.replace(/-/g, ''));
};

export const fetchCCTNSData = async (firNumber: string) => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  if (!firNumber) return null;
  
  // Simulated FIR Record
  return {
    firId: firNumber,
    sections: ["3(1)(r)", "3(1)(s)", "SC/ST Act"],
    incidentDate: "2024-05-01",
    status: "Charge-sheeted",
    complainant: "Verified Profile Match",
    accusedNames: ["Rahul S.", "Unknown"],
    narrative: "The victim was subjected to public humiliation and verbal abuse based on caste identity in a marketplace environment."
  };
};

export const initiatePFMSTransfer = async (beneficiaryId: string, amount: number) => {
  await new Promise(resolve => setTimeout(resolve, 3000));
  return {
    utrNumber: `PFMS${Math.floor(Math.random() * 1000000000)}`,
    timestamp: new Date().toISOString(),
    status: 'SUCCESS'
  };
};
