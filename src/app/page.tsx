"use client";
import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { flashcardsData } from '../data/flashcards';
import { codingProblemsData } from '../data/codingProblems';

// All 12 Engineering Branches Mapped
const branchNamesMap: Record<string, string> = {
    "ai-ds": "Artificial Intelligence & Data Science",
    "cse": "Computer Science & Engineering",
    "it": "Information Technology",
    "ece": "Electronics & Communication (ECE)",
    "eee": "Electrical & Electronics (EEE)",
    "mech": "Mechanical Engineering",
    "civil": "Civil Engineering",
    "chem": "Chemical Engineering",
    "aero": "Aerospace & Aeronautical",
    "robotics": "Robotics & Automation",
    "biotech": "Biotechnology Engineering",
    "metallurgy": "Metallurgical & Materials"
};

// Alumni Directory Data
interface Alum {
    id: number;
    name: string;
    company: string;
    role: string;
    branch: string;
    batch: string;
}

const alumniData: Alum[] = [
    { id: 1, name: "Sarah Jenkins", company: "Google", role: "Software Engineer II", branch: "CSE", batch: "2021" },
    { id: 2, name: "Kavita Deshmukh", company: "Texas Instruments", role: "VLSI Hardware Lead", branch: "ECE", batch: "2019" },
    { id: 3, name: "Rajesh Verma", company: "Tata Motors", role: "Robotics Systems Engineer", branch: "Mech", batch: "2020" },
    { id: 4, name: "Amit Patel", company: "Google", role: "Data Scientist", branch: "AI & DS", batch: "2022" },
    { id: 5, name: "Priya Singh", company: "L&T Heavy Tech", role: "Lead Structural Engineer", branch: "Civil", batch: "2018" },
    { id: 6, name: "Vikram Reddy", company: "Qualcomm Technologies", role: "Embedded Firmware Engineer", branch: "ECE", batch: "2023" },
    { id: 7, name: "Sanya Roy", company: "Siemens Smart Grid", role: "Power Grid Protection Specialist", branch: "EEE", batch: "2021" },
    { id: 8, name: "Arjun Menon", company: "Airbus Engineering Hub", role: "Flight Dynamics Specialist", branch: "Aero", batch: "2020" }
];

// Connected Portals Directory
const portalsDirectory = [
    { name: "AICTE Internship Portal", cat: "Govt / National", desc: "Government technical internship portal for engineering students.", url: "https://internship.aicte-india.org/" },
    { name: "LinkedIn Jobs", cat: "Global / Corporate", desc: "Global professional network and enterprise hiring gateway.", url: "https://www.linkedin.com/jobs/" },
    { name: "Internshala", cat: "Student Internships", desc: "Student internship portal for core engineering, startups, & IT.", url: "https://internshala.com/" },
    { name: "Unstop (Dare2Compete)", cat: "Hackathons / Jobs", desc: "Hiring challenges, hackathons, and engineering competitions.", url: "https://unstop.com/" },
    { name: "Naukri Campus", cat: "Corporate Placement", desc: "Enterprise campus recruitment across all engineering branches.", url: "https://www.naukri.com/" },
    { name: "Wellfound (AngelList)", cat: "Startups & Tech", desc: "Direct engineering roles with venture-backed tech startups.", url: "https://wellfound.com/" },
    { name: "Instahyre", cat: "AI Matching", desc: "Automated candidate-company matching engine.", url: "https://www.instahyre.com/" },
    { name: "Foundit (Monster)", cat: "Corporate Placement", desc: "Corporate recruitment across APAC regions.", url: "https://www.foundit.in/" },
    { name: "Indeed India", cat: "Global / Corporate", desc: "Worldwide search engine for core and software placements.", url: "https://in.indeed.com/" },
    { name: "Glassdoor Jobs", cat: "Global / Corporate", desc: "Company salary benchmarks, reviews, and vacancies.", url: "https://www.glassdoor.co.in/Job/" }
];

interface Opportunity {
    id: number;
    title: string;
    branch: string;
    branchTitle: string;
    company: string;
    location: string;
    type: "Internship" | "Full-Time" | "Campus Placement";
    sourcePortal: string;
    stipend: number;
    minCGPA: number;
    requiredSkills: string[];
    description: string;
    alumCount: number;
    applyUrl: string;
}

function getPortalDirectUrl(portal: string, query: string, company: string) {
    const fullQuery = encodeURIComponent(`${query} ${company}`);
    switch(portal) {
        case "LinkedIn": return `https://www.linkedin.com/jobs/search/?keywords=${fullQuery}`;
        case "AICTE Portal": return `https://internship.aicte-india.org/`;
        case "Internshala": return `https://internshala.com/internships/keywords-${encodeURIComponent(query)}/`;
        case "Unstop": return `https://unstop.com/jobs?searchTerm=${encodeURIComponent(query)}`;
        case "Naukri": return `https://www.naukri.com/${encodeURIComponent(query.toLowerCase().replace(/[^a-z0-9]/g, '-'))}-jobs`;
        case "Wellfound": return `https://wellfound.com/jobs`;
        case "Instahyre": return `https://www.instahyre.com/jobs/`;
        default: return `https://in.indeed.com/jobs?q=${fullQuery}`;
    }
}

// 2,016 Curated Opportunities — 10 Unique Roles × 12 Disciplines × Multi-Portal
function generateOpportunities(): Opportunity[] {
    const branchRoles: Record<string, { title: string; skills: string[]; desc: string }[]> = {
        "ai-ds": [
            { title: "AI Research & Deep Learning Engineer", skills: ["Python", "PyTorch", "TensorFlow", "Machine Learning", "CUDA"], desc: "Design and train large neural networks for NLP, vision, and recommendation systems at scale." },
            { title: "Data Scientist & Predictive Analytics Lead", skills: ["Python", "SQL", "Scikit-learn", "Pandas", "Tableau"], desc: "Build end-to-end predictive models and business intelligence dashboards for enterprise clients." },
            { title: "Computer Vision & Image Processing Engineer", skills: ["Python", "OpenCV", "TensorFlow", "C++", "YOLO"], desc: "Deploy real-time object detection and semantic segmentation for industrial and autonomous systems." },
            { title: "NLP & Large Language Model Engineer", skills: ["Python", "HuggingFace", "PyTorch", "BERT", "Transformers"], desc: "Fine-tune LLMs for enterprise chatbots, document extraction, multilingual translation, and summarization." },
            { title: "MLOps & AI Infrastructure Specialist", skills: ["Python", "Kubernetes", "Docker", "MLflow", "AWS SageMaker"], desc: "Build production ML pipelines with CI/CD, automated retraining, and model drift monitoring." },
            { title: "Data Engineer & ETL Pipeline Architect", skills: ["Python", "Apache Spark", "Kafka", "Airflow", "PostgreSQL"], desc: "Design fault-tolerant streaming data pipelines processing billions of events in near real-time." },
            { title: "Business Intelligence & Analytics Intern", skills: ["SQL", "Power BI", "Python", "Excel", "Data Modeling"], desc: "Create executive dashboards and data storytelling reports to drive strategic product decisions." },
            { title: "Reinforcement Learning Research Intern", skills: ["Python", "PyTorch", "OpenAI Gym", "Q-Learning", "Statistics"], desc: "Train reward-maximizing RL agents for robotics control, game AI, and supply chain optimization." },
            { title: "Graph Analytics & Knowledge Graph Engineer", skills: ["Python", "Neo4j", "Graph Neural Networks", "NLP", "SQL"], desc: "Build knowledge graphs and GNN-based recommendation engines for large enterprise deployments." },
            { title: "Generative AI & Multimodal Systems Intern", skills: ["Python", "Stable Diffusion", "LangChain", "RAG", "OpenAI API"], desc: "Develop generative image-text applications and retrieval-augmented generation (RAG) pipelines." }
        ],
        "cse": [
            { title: "Distributed Backend Software Engineer", skills: ["Python", "Go", "SQL", "PostgreSQL", "Docker"], desc: "Develop high-performance microservices, gRPC APIs, and distributed message queues at scale." },
            { title: "Cloud Infrastructure & DevOps Engineer", skills: ["Linux", "Docker", "Kubernetes", "AWS", "Terraform"], desc: "Configure multi-cloud clusters and build fully automated CI/CD deployment workflows." },
            { title: "Full Stack Web & Mobile Developer", skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "Redis"], desc: "Build scalable SaaS platforms with real-time features, WebSockets, and PWA support." },
            { title: "Cybersecurity & Penetration Testing Analyst", skills: ["Linux", "Python", "Burp Suite", "Metasploit", "Network Security"], desc: "Conduct red-team security assessments, vulnerability scanning, and incident response drills." },
            { title: "Blockchain & Web3 Smart Contract Developer", skills: ["Solidity", "Ethereum", "Rust", "React", "Web3.js"], desc: "Build decentralized applications (dApps), DeFi protocols, and NFT marketplace contracts." },
            { title: "Site Reliability Engineer (SRE)", skills: ["Python", "Go", "Prometheus", "Grafana", "Kubernetes"], desc: "Maintain 99.99% uptime SLAs, build observability stacks, and automate failure runbooks." },
            { title: "Database Architect & Query Optimization Specialist", skills: ["PostgreSQL", "MySQL", "Redis", "MongoDB", "SQL Tuning"], desc: "Design multi-model database schemas and optimize slow queries for sub-10ms response times." },
            { title: "Game Development & Graphics Programming Intern", skills: ["C++", "Unity", "Unreal Engine", "GLSL", "OpenGL"], desc: "Build immersive 3D game worlds with physically-based rendering and real-time physics simulation." },
            { title: "API Design & Microservices Architect", skills: ["Java", "Spring Boot", "REST", "GraphQL", "Kafka"], desc: "Architect event-driven microservices with circuit-breaker patterns and distributed tracing." },
            { title: "Embedded Systems & Firmware Engineer (CSE Track)", skills: ["C", "C++", "RTOS", "ARM Cortex", "Linux Kernel"], desc: "Develop Linux kernel modules, device drivers, and bootloader firmware for industrial IoT gateways." }
        ],
        "it": [
            { title: "Enterprise Cloud Application Developer", skills: ["Java", "Spring Boot", "AWS", "SQL", "Microservices"], desc: "Engineer multi-tenant enterprise SaaS platforms with role-based access control and audit logging." },
            { title: "Cybersecurity Analyst & Threat Intelligence", skills: ["Linux", "Python", "SIEM", "Splunk", "Network Protocols"], desc: "Monitor enterprise SOC dashboards, detect APT threats, and execute DFIR incident response." },
            { title: "IT Governance, Risk & Compliance Analyst", skills: ["ISO 27001", "GDPR", "Risk Management", "Audit", "ITIL"], desc: "Drive regulatory compliance programs and conduct information security risk assessment audits." },
            { title: "ERP Implementation & SAP Consultant", skills: ["SAP S/4HANA", "ABAP", "SQL", "Logistics", "Business Analysis"], desc: "Configure SAP modules for supply chain, finance, and HR across Fortune 500 deployments." },
            { title: "Network Infrastructure & Zero Trust Security", skills: ["Cisco", "Fortinet", "Python", "BGP/OSPF", "SD-WAN"], desc: "Architect zero-trust network segmentation and SD-WAN deployments for global enterprises." },
            { title: "Digital Transformation & IT Strategy Consultant", skills: ["Business Analysis", "Agile", "Cloud Migration", "Power Platform", "SQL"], desc: "Lead cloud migration strategies and digital modernization programs for legacy enterprise systems." },
            { title: "Quality Assurance & Test Automation Engineer", skills: ["Selenium", "Python", "Jest", "Cypress", "API Testing"], desc: "Build automated regression suites, CI test pipelines, and shift-left QA frameworks." },
            { title: "Cloud Security & Identity Access Management", skills: ["AWS IAM", "Azure AD", "OAuth", "Zero Trust", "Terraform"], desc: "Implement cloud-native IAM architectures with privileged access management and SSO." },
            { title: "IT Project Manager & Agile Scrum Master", skills: ["Jira", "Confluence", "Agile", "Risk Management", "PMP"], desc: "Manage cross-functional IT delivery teams using Scrum, Kanban, and SAFe methodologies." },
            { title: "Data Privacy & Information Security Officer", skills: ["GDPR", "PDPA", "Privacy Impact Assessment", "Legal Tech", "DLP"], desc: "Design data classification frameworks and lead privacy-by-design product reviews." }
        ],
        "ece": [
            { title: "VLSI Digital Design & Formal Verification Engineer", skills: ["Verilog", "SystemVerilog", "UVM", "Linux", "Digital Electronics"], desc: "Write UVM testbenches for full-chip ASIC verification and RTL synthesis sign-off." },
            { title: "Embedded Firmware & RTOS Systems Engineer", skills: ["C", "Embedded C++", "FreeRTOS", "ARM Cortex", "CAN Bus"], desc: "Program real-time automotive and industrial firmware on bare-metal and RTOS platforms." },
            { title: "Analog IC & Mixed Signal Design Engineer", skills: ["Cadence Virtuoso", "SPICE", "Analog Circuits", "MATLAB", "Spectre"], desc: "Design and simulate low-power analog amplifiers, PLLs, ADCs, and LDO regulators." },
            { title: "RF & Wireless Communication Systems Engineer", skills: ["RF Design", "MATLAB", "ADS", "5G NR", "Antenna Design"], desc: "Design 5G mmWave phased arrays, RF front-end modules, and link budget analysis." },
            { title: "Signal Processing & DSP Algorithm Engineer", skills: ["MATLAB", "C++", "Python", "FFT", "Kalman Filter"], desc: "Implement real-time DSP algorithms for radar, sonar, audio processing, and biomedical signals." },
            { title: "Semiconductor & CMOS Process Integration Intern", skills: ["Semiconductor Physics", "Fabrication", "Python", "Device Physics", "TCAD"], desc: "Optimize CMOS transistor scaling, yield improvement, and wafer-level test characterization." },
            { title: "PCB Design & High-Speed Hardware Engineer", skills: ["Altium Designer", "OrCAD", "SI Analysis", "EMC", "Gerber"], desc: "Design multi-layer high-speed PCBs with signal integrity analysis and EMC compliance testing." },
            { title: "FPGA Prototyping & RTL Design Engineer", skills: ["VHDL", "Verilog", "Xilinx Vivado", "Intel Quartus", "HLS"], desc: "Prototype ASIC designs on Xilinx/Intel FPGAs for rapid IP development and validation." },
            { title: "Automotive Electronics & CAN/LIN Protocol Engineer", skills: ["AUTOSAR", "CAN Bus", "Embedded C", "ISO 26262", "MATLAB"], desc: "Develop AUTOSAR software components and functional safety modules for automotive ECUs." },
            { title: "5G & Telecom Network Systems Intern", skills: ["5G NR", "Python", "GNU Radio", "Network Slicing", "OpenRAN"], desc: "Simulate 5G NR physical layer, beamforming algorithms, and O-RAN disaggregation frameworks." }
        ],
        "eee": [
            { title: "Power Systems & Smart Grid Protection Engineer", skills: ["MATLAB", "Power Electronics", "Simulink", "ETAP", "Relay Protection"], desc: "Simulate HV transmission networks and design distance relay protection coordination schemes." },
            { title: "EV Powertrain & Battery Management Systems Intern", skills: ["MATLAB", "Embedded C", "BMS", "Li-ion Chemistry", "CAN Bus"], desc: "Optimize state-of-charge and state-of-health algorithms for next-gen electric vehicle batteries." },
            { title: "Renewable Energy & Solar PV Systems Engineer", skills: ["PVSyst", "ETAP", "Power Electronics", "MPPT", "Inverter Design"], desc: "Design utility-scale solar-plus-storage systems with grid interconnection studies." },
            { title: "Industrial Automation & PLC/SCADA Engineer", skills: ["Siemens PLC", "SCADA", "Ladder Logic", "HMI", "Industrial IoT"], desc: "Program PLC-based automation systems for manufacturing lines and process plants." },
            { title: "High Voltage Engineering & GIS Switchgear Intern", skills: ["HV Testing", "GIS", "SF6", "Insulation Coordination", "ETAP"], desc: "Test gas-insulated switchgear, HV cables, and perform insulation coordination studies." },
            { title: "Motor Drives & Variable Frequency Drive Engineer", skills: ["MATLAB Simulink", "Power Electronics", "FOC", "PMSM", "Inverter"], desc: "Design field-oriented control algorithms for PMSM and induction motor variable speed drives." },
            { title: "Energy Audit & Power Quality Analyst", skills: ["Power Quality Analyzer", "MATLAB", "Fluke Tools", "Harmonics", "Energy Audit"], desc: "Conduct industrial energy audits and implement harmonic mitigation strategies." },
            { title: "Smart Metering & AMI Infrastructure Engineer", skills: ["IoT", "Python", "DLMS", "RF Mesh", "Data Analytics"], desc: "Deploy advanced metering infrastructure with real-time energy data aggregation platforms." },
            { title: "Wind Energy & Turbine Control Systems Engineer", skills: ["MATLAB", "FAST", "Wind Resource Analysis", "SCADA", "Control Systems"], desc: "Simulate wind turbine aeroelastic behavior and design MPPT pitch control algorithms." },
            { title: "Protection Relay & Substation Automation Intern", skills: ["IEC 61850", "GOOSE", "Python", "Relay Testing", "ETAP"], desc: "Configure IEC 61850 substation automation protocols and numerical relay protection settings." }
        ],
        "mech": [
            { title: "Robotics & Structural CAD Design Engineer", skills: ["SolidWorks", "ANSYS Mechanical", "Python", "MATLAB", "FEA"], desc: "Perform finite element structural analysis and design robotic arm kinematic linkages." },
            { title: "Manufacturing & CNC Automation Engineer", skills: ["AutoCAD", "PLC", "G-Code", "Industrial IoT", "SolidWorks"], desc: "Automate assembly lines with CNC machining optimization and Industry 4.0 integration." },
            { title: "HVAC & Thermal Systems Design Engineer", skills: ["CFD", "ANSYS Fluent", "Thermodynamics", "HAP", "AutoCAD MEP"], desc: "Design high-efficiency commercial HVAC systems and validate with CFD flow simulations." },
            { title: "Product Design & Rapid Prototyping Intern", skills: ["CATIA V5", "SolidWorks", "3D Printing", "GD&T", "DFM"], desc: "Lead DFM-driven product design cycles from concept sketching to FDM prototype validation." },
            { title: "Quality Control & Six Sigma Black Belt Intern", skills: ["Minitab", "SPC", "FMEA", "Six Sigma", "GD&T"], desc: "Implement SPC charts, Cpk analysis, and FMEA risk assessments on production lines." },
            { title: "Automotive Body & Chassis Dynamics Engineer", skills: ["ADAMS", "NASTRAN", "NVH", "SolidWorks", "Fatigue Analysis"], desc: "Simulate vehicle crash dynamics, NVH performance, and chassis torsional stiffness analysis." },
            { title: "Additive Manufacturing & 3D Printing Specialist", skills: ["FDM", "SLA", "SLS", "CATIA", "Post-Processing"], desc: "Optimize print parameters for metals and polymers in aerospace and medical device manufacturing." },
            { title: "Turbomachinery & Compressor Design Intern", skills: ["ANSYS CFX", "MATLAB", "Turbomachinery", "Thermodynamics", "Pro/E"], desc: "Design centrifugal compressor stages and validate aerodynamic performance with CFD." },
            { title: "Supply Chain & Operations Research Analyst", skills: ["SAP MM", "Python", "Linear Programming", "Lean", "ERP"], desc: "Optimize global supply chain logistics using operations research models and ERP systems." },
            { title: "Failure Analysis & Materials Testing Engineer", skills: ["SEM", "Metallography", "ANSYS", "Failure Analysis", "Materials Science"], desc: "Investigate component failures using fractographic, metallographic, and FEA root cause analysis." }
        ],
        "civil": [
            { title: "Structural Analysis & BIM Design Engineer", skills: ["AutoCAD", "STAAD Pro", "Revit", "ETABS", "IS Codes"], desc: "Model seismic-resistant RCC and steel frameworks using BIM workflows and IS code checks." },
            { title: "Smart City & Urban Infrastructure Planner", skills: ["GIS", "AutoCAD Civil 3D", "SWMM", "Python", "Urban Planning"], desc: "Plan integrated urban transit corridors, water networks, and sustainable storm drainage grids." },
            { title: "Geotechnical & Foundation Design Engineer", skills: ["PLAXIS", "GeoStudio", "Soil Mechanics", "AutoCAD", "Pile Design"], desc: "Perform slope stability analysis and design deep foundation systems for high-rise buildings." },
            { title: "Water Resources & Hydraulics Engineer", skills: ["HEC-RAS", "EPANET", "MATLAB", "Hydrology", "AutoCAD"], desc: "Model floodplain hydraulics, dam break scenarios, and design water distribution networks." },
            { title: "Transportation & Traffic Systems Analyst", skills: ["VISSIM", "SYNCHRO", "Highway Design", "AutoCAD Civil 3D", "GIS"], desc: "Simulate urban traffic signal optimization and design highway interchange geometrics." },
            { title: "Environmental Impact Assessment Engineer", skills: ["Environmental Engineering", "GIS", "Python", "Air Quality Modeling", "EIA"], desc: "Conduct EIA studies for infrastructure projects under MoEFCC regulatory guidelines." },
            { title: "Construction Project Management Trainee", skills: ["MS Project", "Primavera P6", "AutoCAD", "Contract Management", "BIM"], desc: "Manage multi-crore civil construction projects with schedule, cost, and quality control." },
            { title: "Bridge Design & Load Rating Engineer", skills: ["CSiBridge", "STAAD Pro", "IRC Codes", "AutoCAD", "FEA"], desc: "Design pre-stressed concrete and steel box-girder bridges with IRC/AASHTO load analysis." },
            { title: "Pavement & Highway Materials Engineer", skills: ["MX Road", "IRC 37", "Bitumen Testing", "AutoCAD", "Material Testing"], desc: "Design flexible and rigid pavement sections with CBR-based thickness design methodology." },
            { title: "Quantity Surveying & Cost Estimation Analyst", skills: ["Revit", "MS Excel", "BOQ", "Rate Analysis", "AutoCAD"], desc: "Prepare detailed BOQs, cost estimates, and tender documents for infrastructure mega-projects." }
        ],
        "chem": [
            { title: "Process Simulation & Petroleum Refinery Intern", skills: ["Aspen Plus", "MATLAB", "Thermodynamics", "Chemical Kinetics", "HYSYS"], desc: "Optimize distillation columns, HEN design, and catalytic reactor performance in refineries." },
            { title: "Petrochemical & Polymer Process Engineer", skills: ["Aspen HYSYS", "Polymers", "Process Control", "Safety", "PFD/P&ID"], desc: "Simulate catalytic cracking, ethylene cracking, and polymerization downstream units." },
            { title: "Pharmaceutical GMP & Process Scale-up Engineer", skills: ["GMP", "Process Validation", "Aspen Plus", "FDA Guidelines", "DoE"], desc: "Scale pharmaceutical API synthesis from lab to pilot plant under USFDA cGMP compliance." },
            { title: "Food Technology & Quality Assurance Engineer", skills: ["HACCP", "Food Science", "GMP", "FSSAI", "MATLAB"], desc: "Design HACCP plans, optimize food processing operations, and ensure FSSAI compliance." },
            { title: "Environmental & Effluent Treatment Engineer", skills: ["WTP Design", "ETP", "Environmental Engineering", "Python", "Pollution Control"], desc: "Design zero-liquid-discharge ETP systems and achieve CPCB emission compliance targets." },
            { title: "Reaction Engineering & Catalyst Research Intern", skills: ["Aspen Plus", "Chemical Kinetics", "MATLAB", "Heterogeneous Catalysis", "Reactor Design"], desc: "Develop heterogeneous catalyst formulations and plug-flow reactor models for green chemistry." },
            { title: "Safety, Health & Environment (SHE) Officer", skills: ["HAZOP", "LOPA", "Bow Tie Analysis", "PSM", "Fire Safety"], desc: "Conduct HAZOP studies, process safety management audits, and emergency response planning." },
            { title: "Paint, Coatings & Specialty Chemicals Formulation", skills: ["Polymer Chemistry", "Rheology", "ASTM Testing", "Formulation", "Coatings"], desc: "Develop high-performance epoxy, polyurethane, and waterborne coating formulations." },
            { title: "Fertilizer & Agrochemical Process Technologist", skills: ["Ammonia Synthesis", "Aspen", "Urea Process", "Process Safety", "Thermodynamics"], desc: "Optimize Haber-Bosch ammonia synthesis loops and urea granulation circuits." },
            { title: "Nano Materials & Advanced Chemical Synthesis Intern", skills: ["Sol-Gel", "Chemical Vapor Deposition", "XRD", "TEM", "Python"], desc: "Synthesize nanoparticles, thin films, and MOF-based materials for energy storage applications." }
        ],
        "aero": [
            { title: "Aerodynamics & CFD Simulation Engineer", skills: ["ANSYS Fluent", "OpenFOAM", "MATLAB", "Aerodynamics", "Python"], desc: "Run RANS/LES aerodynamic simulations for aircraft, UAVs, and high-speed re-entry vehicles." },
            { title: "Flight Control Systems & Autopilot Engineer", skills: ["Simulink", "C++", "Control Theory", "Avionics", "MATLAB"], desc: "Design fly-by-wire autopilot guidance laws and validate with hardware-in-the-loop simulators." },
            { title: "Structural Stress & Fatigue Analysis Engineer", skills: ["NASTRAN", "PATRAN", "FEA", "Composites", "Fracture Mechanics"], desc: "Perform FAR-25 fatigue life and damage tolerance analysis on airframe structural components." },
            { title: "Propulsion Systems & Gas Turbine Engineer", skills: ["MATLAB", "Thermodynamics", "CFD", "Gas Turbine", "Python"], desc: "Optimize turbofan engine thermodynamic cycles and combustion chamber flow fields." },
            { title: "UAV & Drone Systems Design Intern", skills: ["ArduPilot", "ROS", "SolidWorks", "Python", "Embedded C"], desc: "Design fixed-wing and multi-rotor UAV airframes with autonomous waypoint navigation." },
            { title: "Aircraft Maintenance & MRO Engineering Trainee", skills: ["DGCA Regulations", "Aviation MRO", "NDT", "AMM", "FMEAs"], desc: "Perform scheduled maintenance, borescope inspections, and airworthiness directive compliance." },
            { title: "Satellite & Space Systems Mission Engineer", skills: ["MATLAB", "STK", "Orbital Mechanics", "Python", "GNC"], desc: "Design LEO satellite constellations, ground station links, and attitude determination systems." },
            { title: "Wind Tunnel Testing & Experimental Aerodynamicist", skills: ["PIV", "Schlieren Imaging", "MATLAB", "Data Acquisition", "CFD Correlation"], desc: "Conduct subsonic and transonic wind tunnel experiments and correlate with CFD predictions." },
            { title: "Composite Structures & Aeroelasticity Engineer", skills: ["ABAQUS", "MSC Nastran", "Composites", "Aeroelasticity", "CLT"], desc: "Design carbon fiber composite airframe panels and perform flutter and divergence analysis." },
            { title: "Avionics & Navigation Systems Integration Engineer", skills: ["DO-178C", "ARINC 429", "MATLAB", "GPS/INS", "MIL-STD-1553"], desc: "Integrate avionics systems with DO-178C software certification and MIL-SPEC hardware qualification." }
        ],
        "robotics": [
            { title: "Autonomous Navigation & SLAM Engineer", skills: ["ROS2", "C++", "Python", "LiDAR", "EKF-SLAM"], desc: "Develop graph-based SLAM algorithms and local/global path planners for mobile robots." },
            { title: "Mechatronics & Robot Kinematics Specialist", skills: ["PLC", "SolidWorks", "MATLAB", "Microcontrollers", "Delta Robot"], desc: "Calibrate 6-DOF robot inverse kinematics and tune servo torque control loops." },
            { title: "Computer Vision for Robotics Engineer", skills: ["Python", "OpenCV", "ROS", "YOLO", "Point Cloud"], desc: "Develop 3D scene understanding pipelines with LiDAR point clouds and RGB-D sensors." },
            { title: "Industrial Robot Programming & Integration Intern", skills: ["ABB RAPID", "KUKA KRL", "Fanuc", "SolidWorks", "Force Control"], desc: "Program collaborative robots for precision assembly, welding, and pick-and-place automation." },
            { title: "Swarm Robotics & Multi-Agent Systems Researcher", skills: ["Python", "ROS", "NetLogo", "Game Theory", "C++"], desc: "Design distributed consensus algorithms for heterogeneous robot swarm coordination." },
            { title: "Prosthetics & Rehabilitation Robotics Engineer", skills: ["EMG Signal Processing", "Python", "C++", "Biomechanics", "FEA"], desc: "Develop myoelectric prosthetic hand controllers with adaptive grasp pattern recognition." },
            { title: "Agricultural Robotics & Precision Farming Intern", skills: ["ROS", "Python", "GPS RTK", "Computer Vision", "Drone SDK"], desc: "Build autonomous crop scouting drones and field robots for precision irrigation management." },
            { title: "Underwater ROV & Marine Robotics Engineer", skills: ["ROS", "C++", "DVL", "Pressure Sensors", "Acoustic Modems"], desc: "Design thruster control systems and acoustic-based positioning for deep-sea ROVs." },
            { title: "Human-Robot Interaction (HRI) Research Intern", skills: ["Python", "ROS", "NLP", "Gesture Recognition", "Unity"], desc: "Study natural language and gesture-based interfaces for socially assistive robots." },
            { title: "Digital Twin & Robot Simulation Engineer", skills: ["Gazebo", "ROS2", "Unreal Engine", "Python", "URDF"], desc: "Build physics-accurate digital twins of factory robots for offline programming and validation." }
        ],
        "biotech": [
            { title: "Computational Biology & Genomics Data Analyst", skills: ["Python", "R", "Bioinformatics", "BLAST", "NGS Analysis"], desc: "Analyze whole-genome sequencing data and identify disease-associated genetic variants." },
            { title: "Bioprocess & Upstream Fermentation Engineer", skills: ["Bioprocessing", "GMP", "Bioreactors", "DoE", "Aspen BioProcess"], desc: "Scale microbial fermentation for recombinant protein and vaccine manufacturing." },
            { title: "Bioinformatics & Drug Discovery Research Intern", skills: ["Python", "RDKit", "Docking", "PyMOL", "Cheminformatics"], desc: "Perform structure-based virtual screening and ADMET prediction for lead compound discovery." },
            { title: "Medical Devices & Biomedical Instrumentation Intern", skills: ["Embedded C", "Signal Processing", "LabVIEW", "Sensors", "FDA MDR"], desc: "Develop biosensor-based point-of-care diagnostic devices under FDA 510(k) regulatory framework." },
            { title: "Clinical Research & Regulatory Affairs Associate", skills: ["ICH-GCP", "CTD", "CDISC", "SAS", "Regulatory Writing"], desc: "Prepare CTD dossiers, manage clinical trial data, and coordinate CDSCO/FDA submissions." },
            { title: "Agricultural Biotechnology & GMO Researcher", skills: ["CRISPR-Cas9", "Plant Transformation", "PCR", "Gel Electrophoresis", "R"], desc: "Develop herbicide-tolerant crop varieties using Agrobacterium-mediated gene transformation." },
            { title: "Immunology & Monoclonal Antibody Production Intern", skills: ["ELISA", "Flow Cytometry", "Cell Culture", "Protein A Purification", "mAb"], desc: "Develop and characterize therapeutic monoclonal antibodies for oncology indications." },
            { title: "Synthetic Biology & Metabolic Engineering Researcher", skills: ["COBRA Toolbox", "Python", "Gibson Assembly", "Metabolomics", "Flux Analysis"], desc: "Engineer microbial cell factories for bio-based chemical and biofuel production." },
            { title: "Molecular Diagnostics & qPCR Specialist", skills: ["qRT-PCR", "ddPCR", "FISH", "NGS", "CRISPR Diagnostics"], desc: "Develop multiplex PCR assays for infectious disease and oncology biomarker detection." },
            { title: "Environmental Biotechnology & Bioremediation Engineer", skills: ["Microbiology", "Bioreactor Design", "Python", "16S rRNA", "Metagenomics"], desc: "Engineer microbial consortia for heavy metal bioremediation and wastewater treatment systems." }
        ],
        "metallurgy": [
            { title: "Materials Characterization & Failure Analysis Specialist", skills: ["SEM/EDS", "XRD", "Optical Metallography", "EBSD", "Python"], desc: "Conduct root cause failure investigations using SEM fractography and metallographic analysis." },
            { title: "Extractive Metallurgy & Pyrometallurgy Engineer", skills: ["Thermodynamics", "Phase Diagrams", "FactSage", "Pyrometallurgy", "Refractories"], desc: "Optimize blast furnace burden calculations, tapping operations, and slag chemistry control." },
            { title: "Corrosion Engineering & Protective Coatings Specialist", skills: ["Electrochemistry", "EIS", "ASTM B117", "Cathodic Protection", "NACE"], desc: "Design cathodic protection systems and qualify coating systems per NACE/ISO standards." },
            { title: "Powder Metallurgy & Sintering Process Engineer", skills: ["P/M Processing", "Sintering", "HIP", "Compaction", "Density Analysis"], desc: "Develop powder compaction tooling and optimize sintering profiles for net-shape components." },
            { title: "Non-Destructive Testing (NDT) Level II Engineer", skills: ["UT Testing", "Radiography", "Phased Array UT", "MPI", "ASME Codes"], desc: "Perform ASME Section V NDE inspections on pressure vessels, welds, and structural components." },
            { title: "Heat Treatment & Thermal Processing Metallurgist", skills: ["Heat Treatment", "Dilatometry", "TTT Diagrams", "Hardness Testing", "Metallography"], desc: "Design and validate hardening, tempering, and case-carburizing heat treatment cycles." },
            { title: "Welding Engineering & Metallurgical Joining Specialist", skills: ["WPS/PQR", "GTAW", "Weld Metallurgy", "ASME IX", "Fracture Mechanics"], desc: "Qualify welding procedures and perform PWHT and residual stress management for pressure vessels." },
            { title: "Semiconductor Materials & Thin Film Deposition Engineer", skills: ["PVD", "CVD", "ALD", "XPS", "Ellipsometry"], desc: "Deposit and characterize semiconductor thin films for MEMS, solar cells, and microelectronics." },
            { title: "Battery Materials & Energy Storage Researcher", skills: ["Electrochemistry", "XRD", "SEM", "Python", "Cell Assembly"], desc: "Synthesize and characterize cathode/anode materials for next-generation lithium-ion and solid-state batteries." },
            { title: "Mineral Processing & Hydrometallurgy Intern", skills: ["Flotation", "Leaching", "SX-EW", "HSC Chemistry", "Mineralogy"], desc: "Design heap leach circuits and SX-EW plants for copper and gold hydrometallurgical recovery." }
        ]
    };

    const companies = [
        // FAANG & Tier-1 Global
        "Google", "Microsoft", "Amazon", "Meta", "Apple", "Salesforce",
        // Indian New-Age Tech
        "Flipkart", "Razorpay", "Zomato", "PhonePe", "CRED", "Meesho", "Ola Electric",
        // Global Semiconductors & Electronics
        "Samsung R&D India", "Intel India", "Qualcomm Technologies", "Texas Instruments",
        "NXP Semiconductors", "Broadcom India", "Zeta Semiconductors",
        // Global Engineering MNCs
        "Siemens AG", "ABB India", "Honeywell", "Bosch Mobility", "GE Research",
        "Schneider Electric", "Emerson Automation", "Rockwell Automation",
        // Indian Conglomerates & IT Giants
        "Tata Consultancy Services", "Infosys", "Wipro", "HCL Technologies", "Tech Mahindra",
        "L&T Heavy Tech", "Tata Steel", "Tata Motors", "Mahindra", "Reliance Industries",
        // Defense & Aerospace
        "DRDO", "HAL India", "ISRO", "Airbus Engineering Hub", "Boeing India",
        "BlueShift Defense", "Safran India",
        // PSU & Government
        "BHEL", "NTPC Limited", "ONGC", "HPCL", "GAIL India", "Power Grid India",
        // Pharma & Biotech
        "Dr. Reddys Laboratories", "Cipla", "Sun Pharma", "Biocon", "BioGenix Analytics",
        // Startups & New-age
        "NeuralEdge AI", "Apex Robotics", "ScaleGrid Cloud", "Vanguard Security",
        "GreenPower EV", "Agrocera Biotech"
    ];

    const locations = [
        "Bengaluru (Hybrid)", "Hyderabad (On-site)", "Remote (PAN India)", "Pune (Hybrid)",
        "Gurugram (On-site)", "Mumbai (Remote)", "New Delhi (Hybrid)", "Chennai (On-site)",
        "Noida (On-site)", "Kolkata (Hybrid)", "Ahmedabad (On-site)", "Coimbatore (On-site)",
        "Thiruvananthapuram (Hybrid)", "Singapore (On-site)", "Dubai UAE (On-site)"
    ];

    const portals = [
        "LinkedIn", "AICTE Portal", "Internshala", "Unstop", "Naukri",
        "Wellfound", "Instahyre", "Indeed", "Glassdoor", "HackerEarth Jobs",
        "TechGig", "Hirist"
    ];

    const types = ["Internship", "Full-Time", "Campus Placement"] as const;
    const branchesKeys = Object.keys(branchRoles);
    const dataset: Opportunity[] = [];

    for (let i = 1; i <= 2016; i++) {
        const branchIdx = (i - 1) % branchesKeys.length;
        const branchKey = branchesKeys[branchIdx];
        const templates = branchRoles[branchKey];
        const cycleNum = Math.floor((i - 1) / branchesKeys.length);
        const template = templates[cycleNum % templates.length];

        const company = companies[(i * 3 + cycleNum * 7 + branchIdx * 5) % companies.length];
        const location = locations[(i + cycleNum * 3 + branchIdx) % locations.length];
        const portal = portals[(i * 2 + cycleNum + branchIdx * 3) % portals.length];

        // Distribute: ~40% Internship, ~35% Full-Time, ~25% Campus Placement
        const typeRoll = i % 20;
        const type = types[typeRoll < 8 ? 0 : typeRoll < 15 ? 1 : 2];

        const minCGPA = parseFloat((6.0 + ((i * 7 + cycleNum * 11 + branchIdx * 3) % 41) / 10).toFixed(1));
        const stipend = type === "Full-Time"
            ? (28000 + ((i * 4200 + cycleNum * 3100) % 122000))
            : type === "Campus Placement"
            ? (22000 + ((i * 3800 + cycleNum * 2700) % 98000))
            : (8000 + ((i * 2400 + cycleNum * 1800) % 62000));

        const alumCount = alumniData.filter(a => a.company === company).length;
        const directLink = getPortalDirectUrl(portal, template.title, company);

        dataset.push({
            id: i,
            title: template.title,
            branch: branchKey,
            branchTitle: branchNamesMap[branchKey] || "Engineering",
            company,
            location,
            type,
            sourcePortal: portal,
            stipend,
            minCGPA,
            requiredSkills: template.skills,
            description: template.desc,
            alumCount,
            applyUrl: directLink
        });
    }

    return dataset;
}

const allOpportunities = generateOpportunities();

export default function Home() {
    // Authentication State
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
    const [authUser, setAuthUser] = useState({
        name: "Student",
        handle: "student",
        uniqueId: "student@smartsquad.com"
    });

    // Form inputs for Auth (Clean & Empty by default)
    const [loginHandleInput, setLoginHandleInput] = useState("");
    const [loginPwdInput, setLoginPwdInput] = useState("");
    const [regNameInput, setRegNameInput] = useState("");
    const [regHandleInput, setRegHandleInput] = useState("");
    const [regBranchInput, setRegBranchInput] = useState("ai-ds");
    const [regPwdInput, setRegPwdInput] = useState("");

    // Candidate CV State
    const [candidateCV, setCandidateCV] = useState({
        branch: "ai-ds",
        branchName: "Artificial Intelligence & Data Science",
        cgpa: 8.74,
        year: 2026,
        skills: ["Python", "SQL", "Machine Learning", "Data Structures", "PostgreSQL", "C++", "Linux", "Docker", "AWS"],
        internships: 1,
        projects: "Predictive analytics pipeline with Kafka, neural network recommender, cloud microservices.",
        github: "https://github.com/aditya-meena",
        certifications: "AWS Cloud Practitioner, DeepLearning.AI"
    });

    // Active Navigation Page View
    const [activeView, setActiveView] = useState<string>('jobs-page');
    // Sidebar mobile toggle
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => setIsSidebarOpen(o => !o);

    // Feed Filters & Search
    const [searchQuery, setSearchQuery] = useState("");
    const [branchFilter, setBranchFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");
    const [portalFilter, setPortalFilter] = useState("all");
    const [sortFilter, setSortFilter] = useState("match-desc");
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 12;

    // AI Recommendation State
    const [aiCareerGoal, setAiCareerGoal] = useState("ai-ds");
    const [aiPreferredMode, setAiPreferredMode] = useState("all");
    const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
    const [showAiOutput, setShowAiOutput] = useState(false);

    // Alumni Mentorship State
    const [alumCompanyFilter, setAlumCompanyFilter] = useState("all");
    const [alumBranchFilter, setAlumBranchFilter] = useState("all");
    const [mockBranchSelect, setMockBranchSelect] = useState("AI, Machine Learning & Algorithms (AI & DS)");

    // Modals State
    const [detailsModalJob, setDetailsModalJob] = useState<Opportunity | null>(null);
    const [referralModalTarget, setReferralModalTarget] = useState<{ alumName?: string; company: string } | null>(null);

    // AI Chatbot State
    const chatEndRef = useRef<HTMLDivElement>(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
        { role: 'model', text: '👋 Hi! I\'m your Smart Squad AI Career Advisor — powered by Google Gemini.\n\nAsk me anything about:\n• Jobs, internships & campus placements\n• Resume & interview preparation tips\n• Career paths for any engineering branch\n• Salary benchmarks & company insights\n• GATE, GRE & higher studies guidance\n\nWhat can I help you with today? 🚀' }
    ]);
    const [chatInput, setChatInput] = useState('');
    const [isChatLoading, setIsChatLoading] = useState(false);

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatMessages]);

    // Restore Session
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUser = localStorage.getItem('smartSquadUser');
            if (storedUser) {
                setAuthUser(JSON.parse(storedUser));
                setIsLoggedIn(true);
            }
            const storedCV = localStorage.getItem('smartSquadCV');
            if (storedCV) {
                setCandidateCV(JSON.parse(storedCV));
            }
        }
    }, []);

    // ── FEATURE 1: Dark Mode ──
    const [isDark, setIsDark] = useState(false);
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        document.documentElement.style.setProperty('--bg-body', isDark ? '#0d1117' : '#f0f2ff');
        document.documentElement.style.setProperty('--bg-card', isDark ? '#161b22' : '#ffffff');
        document.documentElement.style.setProperty('--bg-card-hover', isDark ? '#1c2128' : '#fafbff');
        document.documentElement.style.setProperty('--text-main', isDark ? '#8b949e' : '#475569');
        document.documentElement.style.setProperty('--text-heading', isDark ? '#e6edf3' : '#0f172a');
        document.documentElement.style.setProperty('--border-light', isDark ? '#30363d' : '#e2e8f0');
    }, [isDark]);

    // ── FEATURE 3: Bookmarks ──
    const [bookmarks, setBookmarks] = useState<Set<number>>(new Set());
    const toggleBookmark = useCallback((id: number) => {
        setBookmarks(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    }, []);
    const savedJobs = useMemo(() => allOpportunities.filter(o => bookmarks.has(o.id)), [bookmarks]);



    // ── FEATURE 5: Salary Predictor ──
    const [salaryBranch, setSalaryBranch] = useState(candidateCV.branch);
    const [salaryCGPA, setSalaryCGPA] = useState(candidateCV.cgpa);
    const [salarySkills, setSalarySkills] = useState(candidateCV.skills.length);
    const [salaryCity, setSalaryCity] = useState('metro');
    const [salaryResult, setSalaryResult] = useState<{ min: number; max: number; avg: number } | null>(null);
    const runSalaryPredictor = () => {
        const base: Record<string, number> = {
            'ai-ds': 900000, 'cse': 850000, 'it': 700000, 'ece': 650000,
            'eee': 580000, 'mech': 560000, 'civil': 520000, 'chem': 580000,
            'aero': 640000, 'robotics': 750000, 'biotech': 540000, 'metallurgy': 510000
        };
        const b = base[salaryBranch] || 600000;
        const cgpaMultiplier = salaryCGPA >= 9 ? 1.4 : salaryCGPA >= 8 ? 1.25 : salaryCGPA >= 7 ? 1.1 : 1.0;
        const skillMultiplier = 1 + Math.min(0.5, salarySkills * 0.04);
        const cityMultiplier = salaryCity === 'metro' ? 1.15 : salaryCity === 'tier2' ? 1.0 : 0.85;
        const avg = Math.round(b * cgpaMultiplier * skillMultiplier * cityMultiplier / 100000) * 100000;
        setSalaryResult({ min: Math.round(avg * 0.7), max: Math.round(avg * 1.4), avg });
    };

    // ── FEATURE 6: Skills Gap Analyzer ──
    const [gapJob, setGapJob] = useState<Opportunity | null>(null);

    // ── Fraud Detector State ──
    const [fraudText, setFraudText] = useState('');
    const [fraudMode, setFraudMode] = useState<'paste' | 'manual'>('paste');
    const [fraudCompany, setFraudCompany] = useState('');
    const [fraudSalary, setFraudSalary] = useState('');
    const [fraudRole, setFraudRole] = useState('');
    const [fraudEmail, setFraudEmail] = useState('');
    const [fraudResult, setFraudResult] = useState<{score: number; verdict: string; flags: string[]; tips: string[]} | null>(null);
    const [fraudLoading, setFraudLoading] = useState(false);
    const [fraudBranch, setFraudBranch] = useState('all');

    // ── NEW FEATURE 1: Interview Intel Vault ──
    const [hasContributedVault, setHasContributedVault] = useState(false);
    const [vaultReviewInput, setVaultReviewInput] = useState('');
    
    // ── NEW FEATURE 2: Reverse-Pitch Drafts ──
    const [draftPitches, setDraftPitches] = useState<{ id: string; recruiter: string; stipend: string; msg: string; status: 'pending'|'accepted'|'declined' }[]>([
        { id: 'p1', recruiter: 'Google (Cloud Team)', stipend: '₹1.2L/month', msg: 'Saw your React skills, want you for a 3-month project.', status: 'pending' },
        { id: 'p2', recruiter: 'Stripe India', stipend: '₹80k/month', msg: 'Your Open Source contributions are great. Join us.', status: 'pending' }
    ]);
    const handlePitchResponse = (id: string, response: 'accepted'|'declined') => {
        setDraftPitches(prev => prev.map(p => p.id === id ? { ...p, status: response } : p));
    };

    // ── NEW FEATURE 3: Micro-Internship Sprints ──
    const [sprintBids, setSprintBids] = useState<Set<string>>(new Set());
    const [sprintBidModal, setSprintBidModal] = useState<string | null>(null);
    const [sprintBidText, setSprintBidText] = useState('');
    const handleSubmitBid = () => {
        if (!sprintBidModal || sprintBidText.trim().length < 20) return alert("Please write a meaningful proposal.");
        setSprintBids(prev => { const next = new Set(prev); next.add(sprintBidModal); return next; });
        setSprintBidModal(null);
        setSprintBidText('');
    };

    // ── NEW FEATURE 4: AI Skill Debt Analyzer ──
    const [debtJd, setDebtJd] = useState('');
    const [debtResult, setDebtResult] = useState<{ match: number; missing: string[] } | null>(null);
    const [debtLoading, setDebtLoading] = useState(false);
    const handleAnalyzeDebt = async () => {
        if (!debtJd) return alert("Please paste a Job Description.");
        setDebtLoading(true);
        try {
            const res = await fetch('/api/ai-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    message: `Compare my skills (${candidateCV.skills.join(', ')}) against this Job Description. Return strictly a JSON object: {"match": <number 0-100>, "missing": [<array of string skills I am missing>]}. JD: ${debtJd}`,
                    history: []
                })
            });
            const data = await res.json();
            const cleanJson = data.reply.replace(/```json|```/g, '').trim();
            setDebtResult(JSON.parse(cleanJson));
        } catch (e) {
            alert("Failed to analyze. Please try again.");
        }
        setDebtLoading(false);
    };

    // ── NEW FEATURE 5: AI Mock Interview ──
    const [isInterviewing, setIsInterviewing] = useState(false);
    const [interviewStartTime, setInterviewStartTime] = useState(0);
    const [interviewStage, setInterviewStage] = useState<'intro' | 'q1' | 'q2' | 'evaluating' | 'report'>('intro');
    const [evalResult, setEvalResult] = useState<any>(null);
    const [currentAiQuestion, setCurrentAiQuestion] = useState("Hi there! Let's start the mock interview. Tell me about a time you solved a complex technical problem.");
    
    // WebRTC MediaRecorder state
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<BlobPart[]>([]);
    const [recordingTimer, setRecordingTimer] = useState(0);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isInterviewing && interviewStage === 'q1') {
            interval = setInterval(() => setRecordingTimer(prev => prev + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [isInterviewing, interviewStage]);

    const startInterview = async () => {
        setIsInterviewing(true);
        setInterviewStartTime(Date.now());
        setInterviewStage('q1');
        setEvalResult(null);
        setRecordingTimer(0);
        audioChunksRef.current = [];

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            
            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) audioChunksRef.current.push(e.data);
            };

            recorder.start(200);
            mediaRecorderRef.current = recorder;
        } catch (err) {
            alert("Microphone access denied. Please allow microphone access to use this feature.");
            setIsInterviewing(false);
            setInterviewStage('intro');
        }
    };

    const stopInterviewAndEvaluate = async () => {
        setInterviewStage('evaluating');
        
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
        }

        await new Promise(r => setTimeout(r, 500));

        try {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            const reader = new FileReader();
            
            reader.readAsDataURL(audioBlob);
            reader.onloadend = async () => {
                const base64Audio = (reader.result as string).split(',')[1];

                const res = await fetch('/api/interview/evaluate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ audioBase64: base64Audio })
                });
                
                const data = await res.json();
                try {
                    const cleanJson = data.reply.replace(/```json|```/g, '').trim();
                    setEvalResult(JSON.parse(cleanJson));
                } catch(e) {
                    setEvalResult({ confidence_score: 50, content_accuracy_score: 50, hesitation_notes: 'Failed to parse Gemini response.', wrong_statements_detected: ['Parsing error'], improvement_plan: 'Please try again.' });
                }
                setInterviewStage('report');
            };
        } catch(e) {
            setEvalResult({ confidence_score: 0, content_accuracy_score: 0, hesitation_notes: 'Failed to evaluate audio.', wrong_statements_detected: ['Upload error'], improvement_plan: 'Please try again.' });
            setInterviewStage('report');
        }
    };

    // ── NEW EXTENSION 1: WASM Coding Challenges ──
    const [activeCodingProblemId, setActiveCodingProblemId] = useState<number>(1);
    const [pythonCode, setPythonCode] = useState(codingProblemsData[0].defaultCode);
    const [pythonOutput, setPythonOutput] = useState("");
    const [isPyRunning, setIsPyRunning] = useState(false);
    const pyWorkerRef = useRef<Worker | null>(null);

    useEffect(() => {
        const p = codingProblemsData.find(p => p.id === activeCodingProblemId);
        if (p) setPythonCode(p.defaultCode);
    }, [activeCodingProblemId]);

    const runPythonCode = () => {
        setIsPyRunning(true);
        setPythonOutput("Running...");
        if (pyWorkerRef.current) pyWorkerRef.current.terminate();
        
        const worker = new Worker('/pythonWorker.js');
        pyWorkerRef.current = worker;

        const timeout = setTimeout(() => {
            worker.terminate();
            setPythonOutput("Error: Execution timed out (Infinite loop?)");
            setIsPyRunning(false);
        }, 5000);

        worker.onmessage = (e) => {
            clearTimeout(timeout);
            setPythonOutput(e.data.output || (e.data.success ? "Success (no output)" : "Error"));
            setIsPyRunning(false);
        };

        worker.postMessage({ id: 1, code: pythonCode });
    };

    // ── NEW EXTENSION 2: Peer Resume Roasts ──
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [roastComments, setRoastComments] = useState<{x: number, y: number, text: string}[]>([]);
    const [roastInput, setRoastInput] = useState<{x: number, y: number} | null>(null);
    const [roastText, setRoastText] = useState("");
    const [pdfLoaded, setPdfLoaded] = useState(false);

    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setRoastInput({ x, y });
    };

    const addRoastComment = () => {
        if (roastInput && roastText) {
            setRoastComments(prev => [...prev, { ...roastInput, text: roastText }]);
            setRoastInput(null);
            setRoastText("");
        }
    };

    // ── NEW EXTENSION 3: Spaced Repetition Flashcards ──
    const [flashcards, setFlashcards] = useState<{id: number, q: string, a: string, interval: number, ease: number, next: number}[]>(flashcardsData);
    const [currentCardIdx, setCurrentCardIdx] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);

    const sm2Rate = (rating: number) => {
        const card = flashcards[currentCardIdx];
        let newInterval = card.interval;
        let newEase = card.ease + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02));
        if (newEase < 1.3) newEase = 1.3;

        if (rating < 3) {
            newInterval = 1;
        } else if (card.interval === 0) {
            newInterval = 1;
        } else if (card.interval === 1) {
            newInterval = 6;
        } else {
            newInterval = Math.round(card.interval * newEase);
        }

        const nextDate = Date.now() + newInterval * 24 * 60 * 60 * 1000;
        const updated = [...flashcards];
        updated[currentCardIdx] = { ...card, interval: newInterval, ease: newEase, next: nextDate };
        setFlashcards(updated);
        setShowAnswer(false);
        setCurrentCardIdx((prev) => (prev + 1) % flashcards.length);
    };

    // ── NEW EXTENSION 4: GitHub Portfolio Generator ──
    const [ghUsername, setGhUsername] = useState("");
    const [ghProfile, setGhProfile] = useState<any>(null);
    const [ghLoading, setGhLoading] = useState(false);

    const fetchGithub = async () => {
        if (!ghUsername) return;
        setGhLoading(true);
        try {
            const res = await fetch(`https://api.github.com/users/${ghUsername}/repos?per_page=100`);
            if (res.status === 403) throw new Error("GitHub API Rate Limit Exceeded. Try again later.");
            const repos = await res.json();
            
            const languages: Record<string, number> = {};
            let totalStars = 0;
            repos.forEach((r: any) => {
                totalStars += r.stargazers_count;
                if (r.language) languages[r.language] = (languages[r.language] || 0) + 1;
            });
            const topLangs = Object.entries(languages).sort((a, b) => b[1] - a[1]).slice(0, 3);
            const topRepos = repos.sort((a: any, b: any) => b.stargazers_count - a.stargazers_count).slice(0, 3);
            
            setGhProfile({ totalStars, topLangs, topRepos, avatar: repos[0]?.owner?.avatar_url, name: repos[0]?.owner?.login });
        } catch (e: any) {
            alert(e.message || "Failed to fetch GitHub profile.");
        }
        setGhLoading(false);
    };

    // ── NEW EXTENSION 5: Campus Stipend Heatmap ──
    const [heatmapPins, setHeatmapPins] = useState<{lat: number, lng: number, status: string, stipend: string}[]>([
        // Bengaluru
        { lat: 12.9716, lng: 77.5946, status: 'hired', stipend: '₹50k/mo' },
        { lat: 12.9352, lng: 77.6245, status: 'ghosted', stipend: 'Unknown' },
        { lat: 12.9569, lng: 77.7011, status: 'interviewed', stipend: '₹30k/mo' },
        { lat: 13.0, lng: 77.6, status: 'hired', stipend: '₹80k/mo' },
        // Mumbai / Pune
        { lat: 19.0760, lng: 72.8777, status: 'interviewed', stipend: '₹45k/mo' },
        { lat: 19.1136, lng: 72.8697, status: 'hired', stipend: '₹1.1L/mo' },
        { lat: 18.5204, lng: 73.8567, status: 'hired', stipend: '₹40k/mo' },
        { lat: 18.5590, lng: 73.7868, status: 'ghosted', stipend: 'Unknown' },
        // Delhi NCR (Gurgaon/Noida)
        { lat: 28.6139, lng: 77.2090, status: 'ghosted', stipend: 'Unknown' },
        { lat: 28.4595, lng: 77.0266, status: 'hired', stipend: '₹60k/mo' },
        { lat: 28.5355, lng: 77.3910, status: 'interviewed', stipend: '₹25k/mo' },
        // Hyderabad
        { lat: 17.3850, lng: 78.4867, status: 'hired', stipend: '₹75k/mo' },
        { lat: 17.4401, lng: 78.3489, status: 'hired', stipend: '₹95k/mo' },
        { lat: 17.4435, lng: 78.3772, status: 'ghosted', stipend: 'Unknown' },
        // Chennai
        { lat: 13.0827, lng: 80.2707, status: 'interviewed', stipend: '₹35k/mo' },
        { lat: 12.9822, lng: 80.2232, status: 'hired', stipend: '₹65k/mo' },
        // Kolkata / Ahmedabad
        { lat: 22.5726, lng: 88.3639, status: 'ghosted', stipend: 'Unknown' },
        { lat: 23.0225, lng: 72.5714, status: 'hired', stipend: '₹30k/mo' },
    ]);

    useEffect(() => {
        const addScript = (src: string, id: string) => {
            if (!document.getElementById(id)) {
                const s = document.createElement('script');
                s.src = src;
                s.id = id;
                document.head.appendChild(s);
            }
        };
        const addStyle = (href: string, id: string) => {
            if (!document.getElementById(id)) {
                const l = document.createElement('link');
                l.rel = 'stylesheet';
                l.href = href;
                l.id = id;
                document.head.appendChild(l);
            }
        };

        addStyle('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css', 'leaflet-css');
        addScript('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js', 'leaflet-js');
        addScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js', 'pdfjs-js');
    }, []);

    const initMap = useCallback((node: HTMLDivElement | null) => {
        if (node && (window as any).L && !node.innerHTML) {
            const L = (window as any).L;
            // Set view to center of India, zoom level 5 to show all major IT hubs
            const map = L.map(node).setView([20.5937, 78.9629], 5);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(map);

            heatmapPins.forEach(pin => {
                const color = pin.status === 'hired' ? '#10b981' : pin.status === 'ghosted' ? '#ef4444' : '#f59e0b';
                const circle = L.circleMarker([pin.lat, pin.lng], { color, radius: 10, fillOpacity: 0.8 }).addTo(map);
                circle.bindPopup(`<b>Status:</b> ${pin.status.toUpperCase()}<br><b>Stipend:</b> ${pin.stipend}`);
            });

            map.on('click', (e: any) => {
                const newPin = { lat: e.latlng.lat, lng: e.latlng.lng, status: 'interviewed', stipend: 'Unknown' };
                setHeatmapPins(prev => [...prev, newPin]);
                L.circleMarker([newPin.lat, newPin.lng], { color: '#f59e0b', radius: 10, fillOpacity: 0.8 })
                    .addTo(map)
                    .bindPopup(`<b>Status:</b> ${newPin.status}<br><b>Stipend:</b> ${newPin.stipend}`);
            });
        }
    }, [heatmapPins]);

    // ── FEATURE 9: Trending Skills ──
    const trendingSkills = useMemo(() => {
        const pool = branchFilter === 'all' ? allOpportunities : allOpportunities.filter(o => o.branch === branchFilter);
        const freq: Record<string, number> = {};
        pool.forEach(o => o.requiredSkills.forEach(s => { freq[s] = (freq[s] || 0) + 1; }));
        return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 6);
    }, [branchFilter]);
    const maxSkillFreq = trendingSkills[0]?.[1] || 1;

    // ── FEATURE 10: Surprise Me ──
    const [surpriseJobs, setSurpriseJobs] = useState<Opportunity[]>([]);
    const [showSurprise, setShowSurprise] = useState(false);
    const runSurprise = () => {
        const highMatch = allOpportunities
            .filter(o => calculatePrecisionMatch(candidateCV, o).matchPercentage >= 65)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);
        setSurpriseJobs(highMatch);
        setShowSurprise(true);
    };

    // ── V4 FEATURE: Swipe Deck State ──
    const [swipeIndex, setSwipeIndex] = useState(0);
    const swipeDeck = useMemo(() => allOpportunities.slice(0, 20), [allOpportunities]);
    const handleSwipe = (direction: 'left' | 'right', _job: Opportunity) => {
        if (direction === 'right') {
            // Tracker removed
        }
        setSwipeIndex(prev => prev + 1);
    };

    // ── FEATURE 8: 90-Day Roadmap — ALL 12 BRANCHES ──
    const roadmaps: Record<string, { week: string; tasks: string[] }[]> = {
        'ai-ds': [
            { week: 'Week 1–2', tasks: ['Master Python NumPy & Pandas data manipulation', 'Complete ML Crash Course by Google (Coursera)', 'Build linear regression + logistic regression projects'] },
            { week: 'Week 3–4', tasks: ['Learn Scikit-learn classifiers (SVM, Random Forest, XGBoost)', 'Enter a Kaggle beginner competition', 'Set up GitHub profile with proper README and project pins'] },
            { week: 'Week 5–6', tasks: ['Deep Learning with PyTorch — CNN image classifier project', 'Deploy model API with FastAPI on HuggingFace Spaces', 'Apply to 10 AI/ML internships on LinkedIn + Internshala'] },
            { week: 'Week 7–8', tasks: ['NLP: BERT fine-tuning with HuggingFace transformers', 'Build a RAG chatbot using LangChain + a vector DB (FAISS)', 'Write a LinkedIn article about your ML project learnings'] },
            { week: 'Week 9–10', tasks: ['MLOps: Docker + MLflow + GitHub Actions CI/CD pipeline', 'Deploy model on AWS SageMaker (free tier) or GCP Vertex AI', 'Complete 50 LeetCode easy problems for OA prep'] },
            { week: 'Week 11–12', tasks: ['System Design basics: API design, load balancing, caching', 'Mock interviews on Pramp.com (AI/ML + Python rounds)', 'Campus drive preparation: HR round stories using STAR method'] }
        ],
        'cse': [
            { week: 'Week 1–2', tasks: ['DSA: Arrays, Strings, Hashmaps, Two-pointer patterns', 'LeetCode 30 easy problems — aim for <15 min per problem', 'Git & GitHub: branching, pull requests, commit conventions'] },
            { week: 'Week 3–4', tasks: ['Trees, Graphs (BFS/DFS), Dynamic Programming patterns (Knapsack, LCS)', 'Build a REST API with Node.js + Express + PostgreSQL', 'Deploy the API on Vercel/Render with proper documentation'] },
            { week: 'Week 5–6', tasks: ['System Design fundamentals: Load balancers, DB sharding, caching (Redis)', 'React frontend SPA project with state management (Context/Zustand)', 'First open-source contribution on GitHub (fix a bug, add a feature)'] },
            { week: 'Week 7–8', tasks: ['Cloud basics: AWS EC2, S3, RDS, Lambda (free tier)', 'Docker: containerize your backend, multi-container with docker-compose', 'Apply to 15 companies'] },
            { week: 'Week 9–10', tasks: ['LeetCode medium: 30 more problems (graph/DP focus)', 'Mock interviews on Pramp.com — solve + explain your reasoning', 'Resume ATS optimization — mirror keywords from job descriptions'] },
            { week: 'Week 11–12', tasks: ['Full-stack capstone project with auth, DB, API, deploy', 'LinkedIn networking: connect with 20 engineers at target companies', 'Campus placement prep: OS, DBMS, Networks fundamentals revision'] }
        ],
        'it': [
            { week: 'Week 1–2', tasks: ['Master SQL advanced: joins, subqueries, window functions, indexing', 'Learn Java Spring Boot REST API development fundamentals', 'Set up AWS free tier account — explore EC2, S3, IAM'] },
            { week: 'Week 3–4', tasks: ['Linux command line mastery: file system, processes, networking tools', 'Build a Spring Boot CRUD API with MySQL + Postman testing', 'Learn Networking: TCP/IP, HTTP/HTTPS, DNS, OSI model'] },
            { week: 'Week 5–6', tasks: ['Cybersecurity basics: OWASP Top 10, SQL injection, XSS prevention', 'AWS Solutions Architect Associate course (Udemy/freeCodeCamp)', 'Deploy app on AWS with EC2 + RDS + Load Balancer'] },
            { week: 'Week 7–8', tasks: ['Selenium or Cypress test automation — write 20 test cases', 'Docker + Kubernetes intro: containerize and orchestrate your app', 'Apply to 15 IT/cloud/security internships'] },
            { week: 'Week 9–10', tasks: ['Practice aptitude tests on IndiaBIX, PrepInsta for campus OA', 'Mock GD (Group Discussion) preparation with peers', 'Cloud certification: AWS Cloud Practitioner exam prep'] },
            { week: 'Week 11–12', tasks: ['Capstone: Full-stack cloud-deployed project', 'LeetCode 50 easy+medium problems for coding rounds', 'Campus preparation: HR round STAR stories (3 unique stories minimum)'] }
        ],
        'ece': [
            { week: 'Week 1–2', tasks: ['Revise Digital Electronics: Boolean Algebra, Combinational/Sequential circuits', 'Verilog basics on EDA Playground (model a 4-bit counter, MUX)', 'C programming refresher: pointers, structures, memory management'] },
            { week: 'Week 3–4', tasks: ['Embedded C on Arduino/STM32: GPIO, UART, SPI, I2C protocols', 'Build IoT sensor project: temperature/humidity logger with MQTT', 'Microcontroller timer/interrupt project with real hardware'] },
            { week: 'Week 5–6', tasks: ['VLSI: RTL design with Verilog, simulate on ModelSim/Vivado', 'Learn timing analysis, setup/hold violations, clock domain crossing', 'Apply to TI / Qualcomm / Intel / NXP internship programs'] },
            { week: 'Week 7–8', tasks: ['Signal Processing: FFT, FIR/IIR filter design in MATLAB', 'Python for DSP: SciPy signal processing + audio analysis project', 'PCB design basics: KiCad schematic + layout + Gerber generation'] },
            { week: 'Week 9–10', tasks: ['Aptitude test prep: IndiaBIX (Electronics + Aptitude)', 'Mock technical HR: explain your projects to a peer as if to recruiter', 'Core company application sprint: Qualcomm, TI, Bosch, Siemens portals'] },
            { week: 'Week 11–12', tasks: ['GATE preparation: ECE syllabus mapping + 10 years PYQs', 'PSU applications: BHEL, NTPC, HPCL GATE-based recruitment', 'Campus placement final prep: VLSI + Embedded technical revision'] }
        ],
        'eee': [
            { week: 'Week 1–2', tasks: ['Revise Power Systems fundamentals: per-unit analysis, symmetrical components', 'MATLAB/Simulink: model a basic AC circuit + load flow analysis', 'Study Power Electronics: converters, inverters, MOSFET/IGBT switching'] },
            { week: 'Week 3–4', tasks: ['ETAP or PowerWorld: draw and simulate a 3-bus power system', 'Electric Vehicle basics: BMS architecture, Li-ion cell chemistry, SoC estimation', 'Python for EE: automate load calculations, plot power curves'] },
            { week: 'Week 5–6', tasks: ['PLC programming basics: Siemens TIA Portal, Ladder logic automation', 'SCADA intro: HMI design, OPC-UA protocol, data historian', 'Apply to ABB, Siemens, Schneider Electric, L&T EduTech internships'] },
            { week: 'Week 7–8', tasks: ['Smart Grid & FACTS devices: SVC, STATCOM, HVDC systems study', 'Renewable Energy: Solar PV system design using PVSyst (free trial)', 'Wind energy: turbine control, MPPT algorithms in Simulink'] },
            { week: 'Week 9–10', tasks: ['Aptitude + technical mock tests (EE domain: machines, circuits, power)', 'GATE EE preparation: start with Signals & Systems + Networks', 'Apply to PSU recruitment: NTPC, PGCIL, BHEL, ONGC'] },
            { week: 'Week 11–12', tasks: ['Build a capstone: Solar MPPT controller simulation in Simulink', 'LinkedIn: connect with 15 EE engineers at power sector companies', 'Campus prep: electrical machines, power electronics core revision'] }
        ],
        'mech': [
            { week: 'Week 1–2', tasks: ['SolidWorks basics: Part modelling, assembly constraints, drawing views', 'Finish at least 3 3D models: a bracket, a shaft assembly, a gearbox', 'Revise Engineering Mechanics + Strength of Materials fundamentals'] },
            { week: 'Week 3–4', tasks: ['ANSYS Mechanical: static structural + modal analysis on your SolidWorks model', 'Interpret FEA results: von Mises stress, deformation, factor of safety', 'Python for Mech engineers: matplotlib for plotting design curves'] },
            { week: 'Week 5–6', tasks: ['Thermal Systems: ANSYS Fluent basics (CFD mesh, boundary conditions)', 'CATIA V5 or AutoCAD: 2D engineering drawings with GD&T tolerances', 'Apply to Tata Motors, Mahindra, DRDO, L&T MHPS internships'] },
            { week: 'Week 7–8', tasks: ['Manufacturing processes deep dive: casting, forging, machining, welding', 'Six Sigma Green Belt intro: DMAIC methodology, SPC charts in Excel', 'Industrial IoT: understand SCADA, sensors, PLC in smart manufacturing'] },
            { week: 'Week 9–10', tasks: ['GATE ME preparation: Fluid Mechanics + Thermodynamics (high-weightage)', 'Aptitude tests: Quantitative reasoning + technical Mech MCQs', 'Apply to core Mech companies: ISRO, HAL, BHEL, ONGC, Tata Steel'] },
            { week: 'Week 11–12', tasks: ['Capstone project: CAD-FEA-CFD workflow (design → simulate → report)', 'GATE previous year paper: solve 2010–2024 ME papers (time-bound)', 'Campus prep: manufacturing, TOM, Fluid mechanics revision sprint'] }
        ],
        'civil': [
            { week: 'Week 1–2', tasks: ['AutoCAD 2D: draw a residential building plan with dimensions + annotations', 'STAAD Pro basics: model a simple RCC frame, apply loads, check deflection', 'Revise Structural Analysis: propped cantilever, fixed beams, Moment Distribution'] },
            { week: 'Week 3–4', tasks: ['Revit BIM: create a 3D building model with floors, walls, doors, windows', 'ETABS basics: model a multi-story frame for seismic analysis', 'Quantity Surveying: prepare a detailed BOQ for a residential project in Excel'] },
            { week: 'Week 5–6', tasks: ['AutoCAD Civil 3D: road alignment design + cross-section generation', 'SWMM: design a storm drainage network for a small urban area', 'Apply to L&T Construction, Shapoorji, Nuvoco, RITES internships'] },
            { week: 'Week 7–8', tasks: ['GIS basics: QGIS for urban mapping, drainage catchment delineation', 'Geotechnical: PLAXIS 2D slope stability analysis (trial version)', 'Construction management: MS Project for scheduling a construction project'] },
            { week: 'Week 9–10', tasks: ['GATE CE preparation: Structural Analysis + Soil Mechanics (high weightage)', 'Solve 10 years GATE CE papers (timed, review mistakes meticulously)', 'Apply to PSU: CPWD, NHAI, RITES, IRCON, NBCC through GATE'] },
            { week: 'Week 11–12', tasks: ['Capstone: BIM model + structural analysis + cost estimate of a building', 'IS codes revision: IS 456, IS 800, IS 1893 for RCC, steel, and seismic design', 'Campus prep: SOM, Fluid Mechanics, Surveying technical revision'] }
        ],
        'chem': [
            { week: 'Week 1–2', tasks: ['Aspen Plus basics: build a distillation column simulation (crude oil separation)', 'Revise Chemical Engineering Thermodynamics: equations of state, VLE, flash calculations', 'Python for ChE: solve ODEs for reactor design using scipy.integrate'] },
            { week: 'Week 3–4', tasks: ['Aspen HYSYS: simulate a heat exchanger network (HEN) with energy integration', 'Process safety: HAZOP methodology — identify deviations on a PFD/P&ID', 'Draw a detailed P&ID for a simple process unit (reactor + separator + HX)'] },
            { week: 'Week 5–6', tasks: ['Reaction Engineering: MATLAB/Python simulation of CSTR + PFR reactions', 'Apply to oil & gas internships: ONGC, HPCL, BPCL, Reliance, GAIL', 'Apply to pharma internships: Dr. Reddy\'s, Cipla, Sun Pharma process engineering'] },
            { week: 'Week 7–8', tasks: ['Mass Transfer: absorption/stripping column design using HETP method', 'Fluid Mechanics in ChE: Bernoulli + friction losses + pump selection (NPSH)', 'ChE simulation project: complete plant simulation with recycles'] },
            { week: 'Week 9–10', tasks: ['GATE CH preparation: Mass Transfer + Reaction Engineering (key areas)', 'Solve 10 years GATE CH previous papers under exam conditions', 'Apply to PSU: ONGC, BPCL, HPCL, GAIL through GATE scores'] },
            { week: 'Week 11–12', tasks: ['Capstone: Complete process design (reaction + separation + utilities) in Aspen', 'Revise Heat Transfer: LMTD/NTU methods, shell-tube HX design', 'Campus prep: process calculations, thermodynamics, transport phenomena sprint'] }
        ],
        'aero': [
            { week: 'Week 1–2', tasks: ['Revise Aerodynamics: lift/drag, boundary layer theory, NACA airfoil characteristics', 'MATLAB: compute lift polar (Cl vs alpha) for a chosen airfoil', 'Learn OpenFOAM basics: install + run the lid-driven cavity tutorial case'] },
            { week: 'Week 3–4', tasks: ['ANSYS Fluent: subsonic flow over NACA 0012 airfoil — mesh, solve, post-process', 'Interpret CFD results: pressure coefficient Cp, drag polar, stall angle', 'Python for Aero: trajectory simulation, orbital mechanics basics with NumPy'] },
            { week: 'Week 5–6', tasks: ['Propulsion: MATLAB simulation of Brayton cycle (gas turbine) with actual data', 'Structures: NASTRAN/PATRAN or ANSYS static analysis of a wing rib section', 'Apply to ISRO, HAL, DRDO, NAL, Airbus Bengaluru, Boeing India internships'] },
            { week: 'Week 7–8', tasks: ['Stability & Control: derive equations of motion, simulate pitch dynamics in Simulink', 'ArduPilot: understand autopilot architecture, test on SITL (Software in the Loop)', 'UAV design basics: size a fixed-wing UAV (wing loading, thrust-to-weight)'] },
            { week: 'Week 9–10', tasks: ['GATE AE preparation: Aerodynamics + Structures (both high-weightage areas)', 'Solve 10 years GATE AE papers, identify weak topics', 'Apply to defense research internships via DRDO recruitment portal'] },
            { week: 'Week 11–12', tasks: ['Capstone: CFD + FEA integrated study on a UAV component', 'Revise Aircraft Performance: take-off, climb, cruise, landing calculations', 'Campus prep: Aerodynamics, structures, propulsion core revision sprint'] }
        ],
        'robotics': [
            { week: 'Week 1–2', tasks: ['ROS2 (Humble/Iron): install, understand nodes, topics, services, actions', 'Write a ROS2 Python publisher/subscriber for a basic sensor simulation', 'Linear Algebra refresher: rotation matrices, homogeneous transforms, Jacobians'] },
            { week: 'Week 3–4', tasks: ['Robot Kinematics: implement forward + inverse kinematics for a 3-DOF arm in Python', 'Gazebo simulation: spawn a robot URDF, write a joint controller', 'OpenCV + ROS2: build a color-blob tracking node with camera feed'] },
            { week: 'Week 5–6', tasks: ['SLAM basics: run Cartographer or Nav2 SLAM on a simulated environment', 'Path planning: implement A* and Dijkstra algorithms from scratch in Python', 'Apply to Apex Robotics, ABB India, Fanuc, ISRO, Boston Dynamics partner labs'] },
            { week: 'Week 7–8', tasks: ['C++ for robotics: rewrite your ROS2 nodes in C++ (performance matters)', 'Computer Vision: YOLO object detection + 3D bounding box with depth camera', 'PCB basics: design a simple motor driver schematic in KiCad'] },
            { week: 'Week 9–10', tasks: ['Control Systems: PID + LQR controller tuning in Simulink for a quadrotor', 'Apply to robotics startups and research labs (check IIT/IISc project listings)', 'Competitive robotics: register for ABU Robocon or IEEE IROS competitions'] },
            { week: 'Week 11–12', tasks: ['Capstone: autonomous navigation demo in Gazebo (SLAM + Nav2 + manipulation)', 'ROS2 portfolio: publish your packages to GitHub with videos', 'Campus prep: control theory, embedded systems, microcontrollers revision'] }
        ],
        'biotech': [
            { week: 'Week 1–2', tasks: ['Python for Bioinformatics: Biopython library basics (sequence parsing, BLAST)', 'Understand NGS workflow: FASTQ → alignment → variant calling pipeline', 'Revise Molecular Biology: DNA replication, transcription, translation, PCR'] },
            { week: 'Week 3–4', tasks: ['R for genomics: DESeq2 differential gene expression analysis on public dataset', 'Bioinformatics tools: BLAST, Clustal Omega, MEGA (phylogenetic trees)', 'Apply to Dr. Reddy\'s, Biocon, Sun Pharma, Cipla research internships'] },
            { week: 'Week 5–6', tasks: ['Drug Discovery: PyMOL molecular visualization + AutoDock Vina docking tutorial', 'Bioprocess engineering: design a batch fermentation for recombinant protein', 'GMP basics: ICH Q7 guidelines, cleanroom classifications, SOP writing'] },
            { week: 'Week 7–8', tasks: ['CRISPR basics: understand guide RNA design, off-target analysis using online tools', 'Flow Cytometry data analysis: FlowJo or FCS Express (trial versions)', 'Clinical Research: ICH-GCP E6 guidelines, clinical trial phases overview'] },
            { week: 'Week 9–10', tasks: ['GATE BT/XL preparation: Molecular Biology + Bioprocess Engineering sections', 'Apply to CSIR labs, ICMR institutes for research trainee programs', 'Regulatory Affairs basics: CDSCO drug approval pathway in India'] },
            { week: 'Week 11–12', tasks: ['Capstone: Complete bioinformatics pipeline from raw FASTQ to biological insights', 'Publish analysis as a Jupyter notebook on GitHub with clear documentation', 'Campus prep: biochemistry, microbiology, bioprocess core revision sprint'] }
        ],
        'metallurgy': [
            { week: 'Week 1–2', tasks: ['Revise Phase Diagrams: Fe-C diagram, eutectic/eutectoid reactions, TTT/CCT curves', 'FactSage thermodynamic software: compute phase equilibria for a steel alloy', 'Python for metallurgy: plot TTT curves, cooling curves using matplotlib'] },
            { week: 'Week 3–4', tasks: ['Materials characterization: understand XRD, SEM/EDS, TEM — interpret sample spectra', 'ANSYS Mechanical: FEA of a component undergoing thermal cycling (fatigue analysis)', 'Electrochemistry: plot Tafel slopes, understand corrosion potential (Ecorr)'] },
            { week: 'Week 5–6', tasks: ['Welding metallurgy: HAZ microstructure, PWHT effects, residual stress management', 'NDT techniques: understand UT, RT, MPI, PT, ET — interpret test results', 'Apply to Tata Steel, JSW Steel, SAIL, Hindalco, NALCO, DRDO internships'] },
            { week: 'Week 7–8', tasks: ['Powder Metallurgy: study P/M processing, sintering mechanisms, HIP process', 'Semiconductor materials: thin film deposition (PVD, CVD) and characterization', 'Battery materials: cathode/anode chemistries for Li-ion, solid-state batteries'] },
            { week: 'Week 9–10', tasks: ['GATE MT preparation: Thermodynamics + Physical Metallurgy (key areas)', 'Solve 10 years GATE MT papers under timed conditions', 'Apply to PSU: SAIL, NMDC, Hindustan Copper, NALCO through GATE'] },
            { week: 'Week 11–12', tasks: ['Capstone: failure analysis case study — collect images, interpret microstructure, determine root cause', 'Report writing: write a professional failure analysis report (ASTM format)', 'Campus prep: physical metallurgy, mechanical behavior, corrosion revision sprint'] }
        ]
    };
    const [roadmapBranch, setRoadmapBranch] = useState(candidateCV.branch);
    const [roadmapChecks, setRoadmapChecks] = useState<Set<string>>(new Set());
    const currentRoadmap = roadmaps[roadmapBranch] || roadmaps['cse'];
    const totalTasks = currentRoadmap.reduce((sum, w) => sum + w.tasks.length, 0);
    const completedTasks = [...roadmapChecks].filter(k => k.startsWith(roadmapBranch)).length;
    const roadmapPct = Math.round((completedTasks / totalTasks) * 100);
    const toggleRoadmapCheck = (key: string) => {
        setRoadmapChecks(prev => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n; });
    };

    const leaderboard = useMemo(() => {
        const stats: Record<string, { jobs: number; alums: number; avgStipend: number; total: number; branches: Set<string> }> = {};
        allOpportunities.forEach(o => {
            if (!stats[o.company]) stats[o.company] = { jobs: 0, alums: 0, avgStipend: 0, total: 0, branches: new Set() };
            stats[o.company].jobs++;
            stats[o.company].alums = alumniData.filter(a => a.company === o.company).length;
            stats[o.company].total += o.stipend;
            stats[o.company].branches.add(o.branch);
        });
        return Object.entries(stats)
            .map(([name, s]) => ({ name, ...s, avgStipend: Math.round(s.total / s.jobs), branchCount: s.branches.size }))
            .sort((a, b) => (b.jobs + b.alums * 3) - (a.jobs + a.alums * 3))
            .slice(0, 20);
    }, []);
    const [leaderboardBranch, setLeaderboardBranch] = useState('all');
    const [leaderboardSort, setLeaderboardSort] = useState<'score'|'jobs'|'alums'|'salary'>('score');
    const maxJobs = leaderboard[0]?.jobs || 1;

    // Precision Match Calculator
    const calculatePrecisionMatch = (cv: typeof candidateCV, item: Opportunity) => {
        const studentSkillsLower = cv.skills.map(s => s.trim().toLowerCase());
        const reqSkills = item.requiredSkills;

        const matchedSkills = reqSkills.filter(reqSkill =>
            studentSkillsLower.some(s => s.includes(reqSkill.toLowerCase()) || reqSkill.toLowerCase().includes(s))
        );

        const missingSkills = reqSkills.filter(reqSkill =>
            !studentSkillsLower.some(s => s.includes(reqSkill.toLowerCase()) || reqSkill.toLowerCase().includes(s))
        );

        let skillScore = (matchedSkills.length / reqSkills.length) * 50;
        let branchScore = (cv.branch === item.branch) ? 25 : 8;
        let cgpaScore = cv.cgpa >= item.minCGPA ? 15 : (cv.cgpa / item.minCGPA) * 7;
        let experienceBonus = Math.min(10, cv.internships * 5);

        let totalScore = Math.min(100, Math.round(skillScore + branchScore + cgpaScore + experienceBonus));

        return {
            matchPercentage: totalScore,
            matchedSkills,
            missingSkills,
            isCGPAEligible: cv.cgpa >= item.minCGPA
        };
    };

    // Filtered & Sorted Opportunities
    const filteredOpportunities = useMemo(() => {
        const query = searchQuery.toLowerCase().trim();
        let result = allOpportunities.filter(item => {
            const matchesQuery = !query || 
                item.title.toLowerCase().includes(query) || 
                item.company.toLowerCase().includes(query) || 
                item.requiredSkills.some(s => s.toLowerCase().includes(query)) || 
                item.branchTitle.toLowerCase().includes(query);
            const matchesBranch = branchFilter === "all" || item.branch === branchFilter;
            const matchesType = typeFilter === "all" || item.type === typeFilter;
            const matchesPortal = portalFilter === "all" || item.sourcePortal === portalFilter;
            return matchesQuery && matchesBranch && matchesType && matchesPortal;
        });

        result.sort((a, b) => {
            if (sortFilter === "match-desc") {
                return calculatePrecisionMatch(candidateCV, b).matchPercentage - calculatePrecisionMatch(candidateCV, a).matchPercentage;
            } else if (sortFilter === "stipend-desc") {
                return b.stipend - a.stipend;
            }
            return 0;
        });

        return result;
    }, [searchQuery, branchFilter, typeFilter, portalFilter, sortFilter, candidateCV]);

    const totalPages = Math.ceil(filteredOpportunities.length / pageSize) || 1;
    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredOpportunities.slice(start, start + pageSize);
    }, [filteredOpportunities, currentPage]);

    // Handle Login
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const handle = loginHandleInput.trim().toLowerCase().replace(/@smartsquad\.com$/, '').replace(/[^a-z0-9._]/g, '') || "user";
        const newUser = {
            name: handle.charAt(0).toUpperCase() + handle.slice(1),
            handle: handle,
            uniqueId: `${handle}@smartsquad.com`
        };
        setAuthUser(newUser);
        if (typeof window !== 'undefined') localStorage.setItem('smartSquadUser', JSON.stringify(newUser));
        setIsLoggedIn(true);
        setActiveView('jobs-page');
    };

    // Handle Register
    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        const name = regNameInput.trim() || "Candidate";
        const handle = regHandleInput.trim().toLowerCase().replace(/@smartsquad\.com$/, '').replace(/[^a-z0-9._]/g, '') || "candidate";
        const branch = regBranchInput;
        const branchName = branchNamesMap[branch] || "Engineering";

        const newUser = {
            name: name,
            handle: handle,
            uniqueId: `${handle}@smartsquad.com`
        };
        setAuthUser(newUser);
        if (typeof window !== 'undefined') localStorage.setItem('smartSquadUser', JSON.stringify(newUser));
        
        const updatedCV = {
            ...candidateCV,
            branch: branch,
            branchName: branchName
        };
        setCandidateCV(updatedCV);
        if (typeof window !== 'undefined') localStorage.setItem('smartSquadCV', JSON.stringify(updatedCV));
        
        setIsLoggedIn(true);
        setActiveView('profile-page');
    };

    const handleLogout = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('smartSquadUser');
            localStorage.removeItem('smartSquadCV');
        }
        setIsLoggedIn(false);
        setAuthMode('login');
    };

    // Handle Direct Branch Quick Filter from Sidebar
    const filterByBranchDirect = (branchKey: string) => {
        setActiveView('jobs-page');
        setBranchFilter(branchKey);
        setCurrentPage(1);
    };

    // Run AI Engine
    const runAISuggestionEngine = () => {
        let scored = allOpportunities.map(item => {
            const precision = calculatePrecisionMatch(candidateCV, item);
            let aiFitScore = precision.matchPercentage;
            if (item.branch === aiCareerGoal) aiFitScore += 15;
            if (aiPreferredMode !== "all" && item.type === aiPreferredMode) aiFitScore += 10;
            return { ...item, precision, aiFitScore };
        });

        scored.sort((a, b) => b.aiFitScore - a.aiFitScore);
        setAiSuggestions(scored.slice(0, 3));
        setShowAiOutput(true);
    };

    // Handle AI Chat Submit (Gemini-powered)
    const handleChatSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const trimmed = chatInput.trim();
        if (!trimmed || isChatLoading) return;

        const userMsg = { role: 'user' as const, text: trimmed };
        const historyForAPI = chatMessages.filter((_, idx) => idx > 0).slice(-8);

        setChatMessages(prev => [...prev, userMsg]);
        setChatInput('');
        setIsChatLoading(true);

        try {
            // Build frontendContext to inject live data into the AI
            const topJobsContext = allOpportunities
                .filter(job => job.branch === candidateCV.branchName || candidateCV.branchName === 'all' || job.branch === 'all')
                .slice(0, 5) // Only send top 5 to save tokens
                .map(job => `- ${job.title} at ${job.company} (${job.location})`)
                .join('\n');

            const frontendContext = `User Profile:\nBranch: ${candidateCV.branchName}\nCGPA: ${candidateCV.cgpa}\nSkills: ${candidateCV.skills.join(', ')}\n\nLive Jobs on Dashboard (Top 5):\n${topJobsContext}`;

            const res = await fetch('/api/ai-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: trimmed, history: historyForAPI, frontendContext })
            });
            if (!res.ok) throw new Error('Network error');
            const data = await res.json();
            setChatMessages(prev => [...prev, { role: 'model', text: data.reply }]);
        } catch (e) {
            setChatMessages(prev => [...prev, {
                role: 'model',
                text: '⚠️ I had trouble reaching the AI server. Check your network and try again!\n\nMeanwhile, explore 2,000+ listings in the Jobs Feed or set your GEMINI_API_KEY in .env.local for full AI support.'
            }]);
        } finally {
            setIsChatLoading(false);
        }
    };

    const handleChatSuggestion = (q: string) => {
        setChatInput(q);
    };

    // Save Profile CV
    const handleSaveCVProfile = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const branch = (form.elements.namedItem("user-branch") as HTMLSelectElement).value;
        const cgpa = parseFloat((form.elements.namedItem("cgpa") as HTMLInputElement).value) || 8.0;
        const year = parseInt((form.elements.namedItem("grad-year") as HTMLInputElement).value) || 2026;
        const skillsRaw = (form.elements.namedItem("skills") as HTMLInputElement).value;
        const internships = parseInt((form.elements.namedItem("cv-internships") as HTMLInputElement).value) || 0;
        const projects = (form.elements.namedItem("cv-projects") as HTMLTextAreaElement).value;
        const github = (form.elements.namedItem("cv-github") as HTMLInputElement).value;
        const certs = (form.elements.namedItem("cv-certifications") as HTMLInputElement).value;

        const skillsArray = skillsRaw.split(",").map(s => s.trim()).filter(s => s.length > 0);

        setCandidateCV({
            branch: branch,
            branchName: branchNamesMap[branch] || "Engineering",
            cgpa: cgpa,
            year: year,
            skills: skillsArray,
            internships: internships,
            projects: projects,
            github: github,
            certifications: certs
        });

        alert("✅ CV & Branch profile updated! Precision scoring recalibrated over 2,016 active listings.");
    };

    const titlesMap: Record<string, string> = {
        'jobs-page': '2000+ Opportunities (Internship, Full-Time & Campus Placement)',
        'ai-page': 'Smart Squad AI Career Advisor Engine',
        'profile-page': 'Engineering Branch & Comprehensive CV Setup',
        'portals-page': '30+ Connected Portals Directory',
        'alumni-page': 'Alumni Mentorship & Referral Network',
        'rejection-page': 'Rejection Diagnostics & Remedial Analytics Hub'
    };

    // Filtered Alumni
    const filteredAlumni = alumniData.filter(a => {
        const matchComp = alumCompanyFilter === "all" || a.company === alumCompanyFilter;
        const matchBranch = alumBranchFilter === "all" || a.branch === alumBranchFilter;
        return matchComp && matchBranch;
    });

    const userInitials = authUser.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() || "SS";

    // 1. DECOUPLED AUTHENTICATION SCREEN
    if (!isLoggedIn) {
        return (
            <div id="auth-screen">
                {authMode === 'login' ? (
                    <div id="auth-login-section" className="auth-card">
                        <div className="auth-logo">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                                <polyline points="2 17 12 22 22 17"></polyline>
                                <polyline points="2 12 12 17 22 12"></polyline>
                            </svg>
                            <h2>Smart Squad</h2>
                        </div>
                        <div className="auth-header">
                            <h3>Welcome Back</h3>
                            <p>Sign in to access your high-scale career gateway</p>
                        </div>
                        <form onSubmit={handleLogin}>
                            <div className="form-group">
                                <label>Username / Student Handle</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. yourname" 
                                        value={loginHandleInput} 
                                        onChange={e => setLoginHandleInput(e.target.value)} 
                                        required 
                                    />
                                    <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.85rem' }}>@smartsquad.com</span>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input 
                                    type="password" 
                                    placeholder="Enter your password"
                                    value={loginPwdInput} 
                                    onChange={e => setLoginPwdInput(e.target.value)} 
                                    required 
                                />
                            </div>
                            <button type="submit" className="btn" style={{ width: '100%', padding: '0.8rem', marginTop: '0.75rem', fontSize: '0.95rem' }}>
                                Access Portal
                            </button>
                        </form>
                        <div className="auth-switch">
                            New to Smart Squad? <a onClick={() => setAuthMode('register')}>Register Unique ID</a>
                        </div>
                    </div>
                ) : (
                    <div id="auth-register-section" className="auth-card">
                        <div className="auth-logo">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                                <polyline points="2 17 12 22 22 17"></polyline>
                                <polyline points="2 12 12 17 22 12"></polyline>
                            </svg>
                            <h2>Smart Squad</h2>
                        </div>
                        <div className="auth-header">
                            <h3>Register Unique ID</h3>
                            <p>Claim your verified <strong>@smartsquad.com</strong> student identity</p>
                        </div>
                        <form onSubmit={handleRegister}>
                            <div className="form-group">
                                <label>Full Candidate Name</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter your full name" 
                                    value={regNameInput} 
                                    onChange={e => setRegNameInput(e.target.value)} 
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label>Desired Username Handle</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. yourname" 
                                        value={regHandleInput} 
                                        onChange={e => setRegHandleInput(e.target.value)} 
                                        required 
                                    />
                                    <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.85rem' }}>@smartsquad.com</span>
                                </div>
                                <small style={{ color: 'var(--primary)', fontSize: '0.75rem', display: 'block', marginTop: '0.35rem', fontWeight: 600 }}>
                                    Your ID: {regHandleInput ? regHandleInput.toLowerCase().replace(/[^a-z0-9._]/g, '') : 'username'}@smartsquad.com
                                </small>
                            </div>
                            <div className="form-group">
                                <label>Select Engineering Branch (All 12 Disciplines)</label>
                                <select value={regBranchInput} onChange={e => setRegBranchInput(e.target.value)}>
                                    <option value="ai-ds">Artificial Intelligence & Data Science (AI & DS)</option>
                                    <option value="cse">Computer Science & Engineering (CSE)</option>
                                    <option value="it">Information Technology (IT)</option>
                                    <option value="ece">Electronics & Communication Engineering (ECE)</option>
                                    <option value="eee">Electrical & Electronics Engineering (EEE)</option>
                                    <option value="mech">Mechanical Engineering (MECH)</option>
                                    <option value="civil">Civil Engineering (CIVIL)</option>
                                    <option value="chem">Chemical Engineering (CHEM)</option>
                                    <option value="aero">Aerospace & Aeronautical Engineering (AERO)</option>
                                    <option value="robotics">Robotics & Automation / Mechatronics</option>
                                    <option value="biotech">Biotechnology Engineering (BIOTECH)</option>
                                    <option value="metallurgy">Metallurgical & Materials Engineering (MME)</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input 
                                    type="password" 
                                    placeholder="Create a password"
                                    value={regPwdInput} 
                                    onChange={e => setRegPwdInput(e.target.value)} 
                                    required 
                                />
                            </div>
                            <button type="submit" className="btn" style={{ width: '100%', padding: '0.8rem', marginTop: '0.5rem', fontSize: '0.95rem' }}>
                                Generate Unique ID & Enter
                            </button>
                        </form>
                        <div className="auth-switch">
                            Already registered? <a onClick={() => setAuthMode('login')}>Sign In here</a>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // 2. MAIN WORKSPACE DASHBOARD
    const TICKER_ITEMS = [
        { emoji: '🔥', text: '2,016 Active Opportunities Live' },
        { emoji: '🏆', text: 'Google hiring 24 CSE & AI roles' },
        { emoji: '💰', text: '₹42L avg FAANG package (2025–26)' },
        { emoji: '🎓', text: '318 campus placements this month' },
        { emoji: '⚡', text: 'Qualcomm: 12 new ECE internships' },
        { emoji: '🚀', text: 'ISRO & DRDO PSU drives open now' },
        { emoji: '📈', text: 'Python #1 skill across all branches' },
        { emoji: '🌟', text: 'Tata Motors: Mech & Robotics intake' },
        { emoji: '💡', text: 'New: Campus Placement filter added' },
        { emoji: '🤖', text: 'Gemini AI advisor now live — try it!' },
    ];

    return (
        <div id="app-dashboard">
            {/* Mobile sidebar overlay */}
            <div 
                className={`sidebar-overlay ${isSidebarOpen ? 'visible' : ''}`}
                onClick={() => setIsSidebarOpen(false)}
            />
            
            {/* Floating hamburger toggle button (mobile only) */}
            <button
                className={`sidebar-toggle-btn ${isSidebarOpen ? 'open' : ''}`}
                onClick={toggleSidebar}
                aria-label="Toggle navigation"
            >
                <span /><span /><span />
            </button>

            {/* ── LIVE STATS TICKER ── */}
            <div className="stats-ticker-wrapper">
                <div className="stats-ticker">
                    {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                        <span key={i} className="ticker-item">
                            <span className="ticker-dot"></span>
                            {item.emoji} {item.text}
                        </span>
                    ))}
                </div>
            </div>

            {/* Systematic Navigation Sidebar */}
            <aside className={`sidebar ${!isSidebarOpen ? 'sidebar-collapsed' : ''}`}>
                <div className="sidebar-brand" onClick={toggleSidebar} style={{ cursor: 'pointer' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                        <polyline points="2 17 12 22 22 17"></polyline>
                        <polyline points="2 12 12 17 22 12"></polyline>
                    </svg>
                    <div>
                        <h2>Smart Squad</h2>
                        <p>Engineering Career Suite</p>
                    </div>
                </div>

                <div className="sidebar-user">
                    <div className="sidebar-user-header">
                        <div className="user-avatar">{userInitials}</div>
                        <div className="user-name-box">
                            <h4>{authUser.name}</h4>
                            <span className="user-id-badge">{authUser.uniqueId}</span>
                        </div>
                    </div>
                    
                    {/* ── V4 FEATURE 9: GAMIFIED LEVELING SYSTEM ── */}
                    {(() => {
                        const xp = (bookmarks.size * 20) + (roadmapChecks.size * 50);
                        const level = Math.floor(xp / 500) + 1;
                        const nextXp = level * 500;
                        const progress = (xp % 500) / 500 * 100;
                        return (
                            <div style={{ marginTop: '0.75rem', background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                                    <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Level {level} Explorer</span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--accent)' }}>{xp} / {nextXp} XP</span>
                                </div>
                                <div style={{ height: 6, background: '#334155', borderRadius: 3, overflow: 'hidden' }}>
                                    <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #3b82f6, #a855f7)', transition: 'width 1s ease' }} />
                                </div>
                                <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem' }}>
                                    {level >= 1 && <span className="badge" style={{ fontSize: '0.65rem', background: '#3b82f6', color: 'white' }}>🏅 Rookie</span>}
                                    {level >= 2 && <span className="badge" style={{ fontSize: '0.65rem', background: '#8b5cf6', color: 'white' }}>🔥 Hustler</span>}
                                </div>
                            </div>
                        );
                    })()}

                    <div className="user-status-row" style={{ marginTop: '0.75rem' }}>
                        <span style={{ color: 'var(--success)', fontWeight: 600 }}>● Active Profile</span>
                        <a style={{ cursor: 'pointer', color: 'var(--accent)', fontWeight: 600 }} onClick={() => setActiveView('profile-page')}>Edit CV</a>
                    </div>
                </div>

                <div className="sidebar-nav-title">Main Features</div>
                <ul className="sidebar-menu">
                    <li><a className={`nav-tab ${activeView === 'jobs-page' ? 'active' : ''}`} onClick={() => { setActiveView('jobs-page'); setIsSidebarOpen(false); }}>💼 2000+ Opportunities</a></li>
                    <li><a className={`nav-tab ${activeView === 'ai-page' ? 'active' : ''}`} onClick={() => { setActiveView('ai-page'); setIsSidebarOpen(false); }}>✨ AI Match Engine</a></li>
                    <li><a className={`nav-tab ${activeView === 'profile-page' ? 'active' : ''}`} onClick={() => { setActiveView('profile-page'); setIsSidebarOpen(false); }}>📋 CV & Branch Profile</a></li>
                    <li><a className={`nav-tab ${activeView === 'portals-page' ? 'active' : ''}`} onClick={() => { setActiveView('portals-page'); setIsSidebarOpen(false); }}>🌐 30+ Portals</a></li>
                    <li><a className={`nav-tab ${activeView === 'alumni-page' ? 'active' : ''}`} onClick={() => { setActiveView('alumni-page'); setIsSidebarOpen(false); }}>🤝 Alumni Network</a></li>
                    <li><a className={`nav-tab ${activeView === 'rejection-page' ? 'active' : ''}`} onClick={() => { setActiveView('rejection-page'); setIsSidebarOpen(false); }}>📊 Rejection Analytics</a></li>
                    <li><a className={`nav-tab ${activeView === 'roadmap-page' ? 'active' : ''}`} onClick={() => { setActiveView('roadmap-page'); setIsSidebarOpen(false); }}>🗺️ 90-Day Prep Roadmap</a></li>
                    <li>
                        <a className={`nav-tab ${activeView === 'saved-page' ? 'active' : ''}`} onClick={() => { setActiveView('saved-page'); setIsSidebarOpen(false); }}>
                            ⭐ Saved Jobs
                            {bookmarks.size > 0 && (
                                <span style={{ marginLeft: 'auto', background: 'var(--primary)', color: 'white', borderRadius: '10px', padding: '0 6px', fontSize: '0.7rem', fontWeight: 800 }}>{bookmarks.size}</span>
                            )}
                        </a>
                    </li>
                    <li><a className={`nav-tab ${activeView === 'leaderboard-page' ? 'active' : ''}`} onClick={() => { setActiveView('leaderboard-page'); setIsSidebarOpen(false); }}>🏆 Company Leaderboard</a></li>
                    <li><a className={`nav-tab ${activeView === 'fraud-page' ? 'active' : ''}`} onClick={() => { setActiveView('fraud-page'); setIsSidebarOpen(false); }}>🛡️ Fraud Detector</a></li>
                </ul>

                <div className="sidebar-nav-title" style={{ marginTop: '0.85rem' }}>Platform Extensions</div>
                <ul className="sidebar-menu">
                    <li><a className={`nav-tab ${activeView === 'intel-vault-page' ? 'active' : ''}`} onClick={() => { setActiveView('intel-vault-page'); setIsSidebarOpen(false); }}>🔒 Interview Intel Vault</a></li>
                    <li><a className={`nav-tab ${activeView === 'talent-drafts-page' ? 'active' : ''}`} onClick={() => { setActiveView('talent-drafts-page'); setIsSidebarOpen(false); }}>🤝 Talent Drafts (Reverse-Pitch)</a></li>
                    <li><a className={`nav-tab ${activeView === 'sprints-page' ? 'active' : ''}`} onClick={() => { setActiveView('sprints-page'); setIsSidebarOpen(false); }}>⚡ Micro-Internship Sprints</a></li>
                    <li><a className={`nav-tab ${activeView === 'skill-debt-page' ? 'active' : ''}`} onClick={() => { setActiveView('skill-debt-page'); setIsSidebarOpen(false); }}>🤖 AI Skill Debt Analyzer</a></li>
                    <li><a className={`nav-tab ${activeView === 'mock-interview-page' ? 'active' : ''}`} onClick={() => { setActiveView('mock-interview-page'); setIsSidebarOpen(false); }}>🎙️ AI Mock Interview</a></li>
                </ul>

                <div className="sidebar-nav-title" style={{ marginTop: '0.85rem' }}>Zero-Compute Tools</div>
                <ul className="sidebar-menu">
                    <li><a className={`nav-tab ${activeView === 'coding-challenges' ? 'active' : ''}`} onClick={() => { setActiveView('coding-challenges'); setIsSidebarOpen(false); }}>💻 WASM Coding Challenges</a></li>
                    <li><a className={`nav-tab ${activeView === 'resume-roasts' ? 'active' : ''}`} onClick={() => { setActiveView('resume-roasts'); setIsSidebarOpen(false); }}>🔥 Peer Resume Roasts</a></li>
                    <li><a className={`nav-tab ${activeView === 'flashcards' ? 'active' : ''}`} onClick={() => { setActiveView('flashcards'); setIsSidebarOpen(false); }}>🧠 Spaced Repetition Flashcards</a></li>
                    <li><a className={`nav-tab ${activeView === 'github-portfolio' ? 'active' : ''}`} onClick={() => { setActiveView('github-portfolio'); setIsSidebarOpen(false); }}>🐙 GitHub Portfolio Generator</a></li>
                    <li><a className={`nav-tab ${activeView === 'campus-heatmap' ? 'active' : ''}`} onClick={() => { setActiveView('campus-heatmap'); setIsSidebarOpen(false); }}>🗺️ Stipend & Ghosting Heatmap</a></li>
                </ul>


                <div className="sidebar-nav-title" style={{ marginTop: '0.85rem' }}>Branch Quick Filters (All 12)</div>
                <ul className="sidebar-menu">
                    <li><a onClick={() => { filterByBranchDirect('ai-ds'); setIsSidebarOpen(false); }}><span style={{ color: '#a855f7' }}>●</span> AI & Data Science</a></li>
                    <li><a onClick={() => { filterByBranchDirect('cse'); setIsSidebarOpen(false); }}><span style={{ color: '#3b82f6' }}>●</span> Computer Science / IT</a></li>
                    <li><a onClick={() => { filterByBranchDirect('ece'); setIsSidebarOpen(false); }}><span style={{ color: '#10b981' }}>●</span> ECE & VLSI</a></li>
                    <li><a onClick={() => { filterByBranchDirect('eee'); setIsSidebarOpen(false); }}><span style={{ color: '#06b6d4' }}>●</span> Electrical (EEE)</a></li>
                    <li><a onClick={() => { filterByBranchDirect('mech'); setIsSidebarOpen(false); }}><span style={{ color: '#f59e0b' }}>●</span> Mechanical & Auto</a></li>
                    <li><a onClick={() => { filterByBranchDirect('civil'); setIsSidebarOpen(false); }}><span style={{ color: '#ef4444' }}>●</span> Civil & Structures</a></li>
                    <li><a onClick={() => { filterByBranchDirect('robotics'); setIsSidebarOpen(false); }}><span style={{ color: '#ec4899' }}>●</span> Robotics & Mechatronics</a></li>
                    <li><a onClick={() => { filterByBranchDirect('aero'); setIsSidebarOpen(false); }}><span style={{ color: '#6366f1' }}>●</span> Aerospace & Avionics</a></li>
                    <li><a onClick={() => { filterByBranchDirect('chem'); setIsSidebarOpen(false); }}><span style={{ color: '#14b8a6' }}>●</span> Chemical Engineering</a></li>
                    <li><a onClick={() => { filterByBranchDirect('biotech'); setIsSidebarOpen(false); }}><span style={{ color: '#84cc16' }}>●</span> Biotechnology</a></li>
                    <li><a onClick={() => { filterByBranchDirect('metallurgy'); setIsSidebarOpen(false); }}><span style={{ color: '#8b5cf6' }}>●</span> Metallurgy & Materials</a></li>
                </ul>

                <div className="sidebar-footer">
                    <button className="btn btn-outline" style={{ width: '100%', borderColor: 'rgba(255,255,255,0.2)', color: 'white' }} onClick={handleLogout}>
                        🚪 Logout Session
                    </button>
                    <div style={{ fontSize: '0.7rem', color: 'var(--sidebar-text)', marginTop: '0.85rem' }}>
                        Unified Academia-Industry &copy; 2026
                    </div>
                </div>
            </aside>

            {/* Main Content Workspace */}
            <main className="main-content">
                <header className="top-header">
                    <h1>{({
                        'jobs-page': '💼 2000+ Opportunities',
                        'ai-page': '✨ AI Match Engine',
                        'profile-page': '📋 CV & Branch Profile',
                        'portals-page': '🌐 30+ Connected Portals',
                        'alumni-page': '🤝 Alumni Mentorship Network',
                        'rejection-page': '📊 Rejection Analytics Hub',
                        'saved-page': '⭐ Saved Jobs',
                        'roadmap-page': '🗺️ 90-Day Prep Roadmap',
                        'leaderboard-page': '🏆 Company Leaderboard',
                        'fraud-page': '🛡️ Internship / Job Fraud Detector',
                        'cold-email-page': '📧 Cold Email Generator',
                        'ats-scanner-page': '🔍 ATS Resume Scanner',
                        'hidden-market-page': '🕵️ Hidden Market Explorer',
                        'offer-comparator-page': '⚖️ Offer Comparator',
                        'interview-predictor-page': '🔮 Interview Predictor',
                        'salary-coach-page': '💬 Salary Negotiation Coach',
                        'visa-hub-page': '🌐 Visa & Sponsorship Hub',
                        'hackathon-board-page': '🚀 Open Source & Hackathon Board',
                        'peer-interview-page': '👥 Peer Mock Interview Matcher',
                        'equity-analyzer-page': '📈 Startup Equity Analyzer'
                    } as Record<string,string>)[activeView] || 'Smart Squad'}</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span className="badge pass" style={{ fontSize: '0.78rem' }}>
                            {candidateCV.branchName.split(' ')[0]}
                        </span>
                        <span className="user-id-badge" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                            {authUser.uniqueId}
                        </span>
                        {/* Dark Mode Toggle */}
                        <button
                            onClick={() => setIsDark(d => !d)}
                            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                            style={{
                                width: 36, height: 36, borderRadius: '50%',
                                background: isDark ? '#f59e0b' : '#1e293b',
                                color: 'white', border: 'none', cursor: 'pointer',
                                fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                boxShadow: isDark ? '0 0 12px rgba(245,158,11,0.4)' : '0 0 12px rgba(30,41,59,0.3)'
                            }}
                        >{isDark ? '☀️' : '🌙'}</button>
                    </div>
                </header>

                <div className="content-container">
                    {/* MODULE 1: 1000+ LIVE CHOICES */}
                    {activeView === 'jobs-page' && (
                        <section className="page-view active-view">
                            {/* ── V4 FEATURE 1: Hero Banner Carousel ── */}
                            <div className="hero-carousel reveal visible">
                                <img src="/images/hero_banner_1787992925134.jpg" alt="Campus Placements" />
                                <div className="hero-overlay">
                                    <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: 800, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>Launch Your Engineering Career</h2>
                                    <p style={{ fontSize: '1.1rem', maxWidth: '600px', opacity: 0.9, textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>Explore 2,016+ curated opportunities tailored to your branch. From exclusive internships to top-tier campus placements.</p>
                                </div>
                            </div>

                            <div className="section-title">
                                <h2>Live Integrated Feed — 2,016 Opportunities</h2>
                                <p>Real listings across 12 branches · 50+ companies · 12 portals · Internship, Full-Time &amp; Campus Placement</p>
                            </div>

                            {/* ── FEATURE 9: Trending Skills Widget ── */}
                            {trendingSkills.length > 0 && (
                                <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                                        <h3 style={{ margin: 0, padding: 0, border: 'none', fontSize: '0.9rem' }}>🔥 Trending Skills — {branchFilter === 'all' ? 'All Branches' : branchNamesMap[branchFilter]}</h3>
                                        <span className="badge" style={{ fontSize: '0.7rem' }}>Live demand</span>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {trendingSkills.map(([skill, count]) => (
                                            <div key={skill} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <span style={{ width: 130, fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-heading)', flexShrink: 0 }}>{skill}</span>
                                                <div style={{ flex: 1, height: 8, background: 'var(--border-light)', borderRadius: 4, overflow: 'hidden' }}>
                                                    <div style={{
                                                        height: '100%',
                                                        width: `${(count / maxSkillFreq) * 100}%`,
                                                        background: 'linear-gradient(90deg, var(--primary), var(--accent))',
                                                        borderRadius: 4,
                                                        transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)'
                                                    }} />
                                                </div>
                                                <span style={{ fontSize: '0.72rem', color: 'var(--text-main)', width: 40, textAlign: 'right' }}>{count}×</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ── FEATURE 10: Surprise Me ── */}
                            <div style={{ marginBottom: '1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                <button
                                    className="btn"
                                    style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)', boxShadow: '0 4px 16px rgba(245,158,11,0.35)' }}
                                    onClick={runSurprise}
                                >
                                    🎲 Surprise Me!
                                </button>
                                {showSurprise && surpriseJobs.length > 0 && (
                                    <span style={{ fontSize: '0.82rem', color: 'var(--text-main)' }}>
                                        ✨ Here are 3 high-match picks just for you!
                                        <button onClick={() => setShowSurprise(false)} style={{ marginLeft: 8, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', fontSize: '0.8rem' }}>✕ Clear</button>
                                    </span>
                                )}
                            </div>

                            {/* Surprise results */}
                            {showSurprise && surpriseJobs.length > 0 && (
                                <div className="grid-3" style={{ marginBottom: '1rem' }}>
                                    {surpriseJobs.map(item => {
                                        const m = calculatePrecisionMatch(candidateCV, item);
                                        return (
                                            <div key={item.id} className="card" style={{ border: '2px solid #f59e0b', background: 'linear-gradient(135deg, #fffbeb, white)' }}>
                                                <div>
                                                    <h3 style={{ fontSize: '1rem' }}>
                                                        🎲 {item.title}
                                                        <span className="badge pass">{m.matchPercentage}% Fit</span>
                                                    </h3>
                                                    <p style={{ fontSize: '0.83rem', color: 'var(--text-main)' }}><strong>{item.company}</strong> · {item.location}</p>
                                                    <p style={{ fontSize: '0.8rem', margin: '0.4rem 0' }}>₹{item.stipend.toLocaleString('en-IN')}/mo · Min CGPA {item.minCGPA}</p>
                                                </div>
                                                <div className="btn-group">
                                                    {/* Tracker removed */}
                                                    <a href={item.applyUrl} target="_blank" rel="noopener noreferrer" className="btn">Apply ↗</a>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            <div className="toolbar">
                                <input 
                                    type="text" 
                                    placeholder="Search roles, companies, tech requirements, or branch..." 
                                    style={{ flex: 1 }} 
                                    value={searchQuery}
                                    onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                />
                                <select value={branchFilter} onChange={e => { setBranchFilter(e.target.value); setCurrentPage(1); }}>
                                    <option value="all">All 12 Engineering Branches</option>
                                    <option value="ai-ds">Artificial Intelligence & Data Science</option>
                                    <option value="cse">Computer Science & Engineering</option>
                                    <option value="it">Information Technology</option>
                                    <option value="ece">Electronics & Communication (ECE)</option>
                                    <option value="eee">Electrical & Electronics (EEE)</option>
                                    <option value="mech">Mechanical Engineering</option>
                                    <option value="civil">Civil Engineering</option>
                                    <option value="chem">Chemical Engineering</option>
                                    <option value="aero">Aerospace & Aeronautical</option>
                                    <option value="robotics">Robotics & Automation</option>
                                    <option value="biotech">Biotechnology Engineering</option>
                                    <option value="metallurgy">Metallurgical & Materials</option>
                                </select>
                                <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setCurrentPage(1); }}>
                                    <option value="all">All Offer Types</option>
                                    <option value="Internship">🎓 Internships</option>
                                    <option value="Full-Time">💼 Full-Time Jobs</option>
                                    <option value="Campus Placement">🏛️ Campus Placement</option>
                                </select>
                                <select value={portalFilter} onChange={e => { setPortalFilter(e.target.value); setCurrentPage(1); }}>
                                    <option value="all">All 12 Portals</option>
                                    <option value="LinkedIn">LinkedIn</option>
                                    <option value="AICTE Portal">AICTE Portal</option>
                                    <option value="Internshala">Internshala</option>
                                    <option value="Unstop">Unstop</option>
                                    <option value="Naukri">Naukri</option>
                                    <option value="Wellfound">Wellfound</option>
                                    <option value="Instahyre">Instahyre</option>
                                    <option value="Indeed">Indeed</option>
                                    <option value="Glassdoor">Glassdoor</option>
                                    <option value="HackerEarth Jobs">HackerEarth</option>
                                    <option value="TechGig">TechGig</option>
                                    <option value="Hirist">Hirist</option>
                                </select>
                                <select value={sortFilter} onChange={e => setSortFilter(e.target.value)}>
                                    <option value="match-desc">Sort: Highest Match %</option>
                                    <option value="stipend-desc">Sort: Compensation</option>
                                </select>
                            </div>

                            <div style={{ marginBottom: '1.5rem', color: 'var(--text-main)', fontSize: '0.95rem', fontWeight: 500 }}>
                                Showing <strong style={{ color: 'var(--primary)' }}>{filteredOpportunities.length}</strong> matching opportunities 
                                &nbsp;·&nbsp; <span style={{ color: 'var(--text-main)', fontSize: '0.85rem' }}>Total pool: <strong style={{ color: 'var(--primary-dark)' }}>2,016 curated listings</strong> across 12 branches, 50+ companies, 12 portals</span>
                            </div>

                            {filteredOpportunities.length === 0 ? (
                                <div className="card" style={{ textAlign: 'center', padding: '2.5rem' }}>
                                    <p style={{ color: 'var(--text-main)', fontWeight: 500 }}>
                                        No opportunities match this filter criteria. Try expanding branch or portal filters.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid-3">
                                    {paginatedItems.map(item => {
                                        const matchData = calculatePrecisionMatch(candidateCV, item);
                                        const badgeClass = matchData.matchPercentage >= 80 ? "pass" : (matchData.matchPercentage >= 60 ? "warn" : "fail");
                                        const typeBadgeClass = item.type === 'Internship' ? 'type-badge-internship' : item.type === 'Full-Time' ? 'type-badge-fulltime' : 'type-badge-placement';
                                        const typeEmoji = item.type === 'Internship' ? '🎓' : item.type === 'Full-Time' ? '💼' : '🏛️';
                                        const isBookmarked = bookmarks.has(item.id);
                                        return (
                                            <div key={item.id} className="card" style={{ position: 'relative' }}>
                                                {/* Bookmark button */}
                                                <button
                                                    onClick={() => toggleBookmark(item.id)}
                                                    title={isBookmarked ? 'Remove bookmark' : 'Bookmark this job'}
                                                    style={{
                                                        position: 'absolute', top: 12, right: 12,
                                                        background: 'none', border: 'none', cursor: 'pointer',
                                                        fontSize: '1.2rem', transition: 'transform 0.2s',
                                                        transform: isBookmarked ? 'scale(1.2)' : 'scale(1)'
                                                    }}
                                                >{isBookmarked ? '⭐' : '☆'}</button>

                                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                                    {/* V4 FEATURE: Company Logo */}
                                                    <div style={{ width: 48, height: 48, background: 'var(--bg-body)', borderRadius: 12, overflow: 'hidden', flexShrink: 0, border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <img src="/images/company_logo_placeholder_1787993020840.jpg" alt="Logo" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <h3 style={{ fontSize: '1rem', paddingRight: '2rem' }}>
                                                            <span>{item.title}</span>
                                                            <span className={`badge ${badgeClass}`} style={{ marginLeft: 8 }}>{matchData.matchPercentage}% Fit</span>
                                                        </h3>
                                                        <p style={{ fontSize: '0.83rem', color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                                                            <strong style={{ color: 'var(--text-heading)' }}>{item.company}</strong> · {item.location}<br />
                                                            <span className={`badge ${typeBadgeClass}`} style={{ fontSize: '0.7rem', marginTop: '0.3rem' }}>{typeEmoji} {item.type}</span>
                                                            {' '}<span className="badge" style={{ background: '#e0f2fe', color: 'var(--accent)', fontSize: '0.7rem' }}>{item.sourcePortal}</span>
                                                            {item.alumCount > 0 && <span className="badge alum" style={{ fontSize: '0.7rem' }}>🔥 {item.alumCount} Alumni</span>}
                                                        </p>
                                                    </div>
                                                </div>
                                                
                                                <p style={{ fontSize: '0.82rem', color: 'var(--text-heading)', marginBottom: '0.5rem', lineHeight: 1.4, marginTop: '0.5rem' }}>{item.description}</p>
                                                <p style={{ fontSize: '0.83rem', marginBottom: '0.5rem' }}>
                                                    <strong>Comp:</strong> ₹{item.stipend.toLocaleString('en-IN')}/mo · <strong>Min CGPA:</strong> {item.minCGPA}
                                                </p>
                                                    <div className="tag-list" style={{ margin: '0.4rem 0 0.6rem' }}>
                                                        {matchData.matchedSkills.map(s => (
                                                            <span key={s} className="tag" style={{ background: '#dcfce7', color: '#047857', borderColor: '#a7f3d0', fontSize: '0.72rem' }}>✓ {s}</span>
                                                        ))}
                                                        {matchData.missingSkills.map(s => (
                                                            <span key={s} className="tag" style={{ background: '#fef2f2', color: '#b91c1c', borderColor: '#fecaca', fontSize: '0.72rem' }}>✕ {s}</span>
                                                        ))}
                                                    </div>
                                                <div className="btn-group">
                                                    <button className="btn btn-outline" style={{ fontSize: '0.78rem', padding: '0.45rem 0.7rem' }} onClick={() => { setGapJob(item); }}>📋 Skills Gap</button>
                                                    {item.alumCount > 0 ? (
                                                        <button className="btn btn-outline" style={{ fontSize: '0.78rem', padding: '0.45rem 0.7rem', color: 'var(--primary-dark)', borderColor: '#c7d2fe', background: '#e0e7ff' }} onClick={() => setReferralModalTarget({ company: item.company })}>Referral</button>
                                                    ) : (
                                                        <button className="btn btn-outline" style={{ fontSize: '0.78rem', padding: '0.45rem 0.7rem' }} onClick={() => setDetailsModalJob(item)}>Score</button>
                                                    )}
                                                    <a href={item.applyUrl} target="_blank" rel="noopener noreferrer" className="btn" style={{ fontSize: '0.78rem', padding: '0.45rem 0.8rem' }}>Apply ↗</a>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="pagination-container">
                                    {currentPage > 1 && (
                                        <button className="page-btn" onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>
                                            &larr; Prev
                                        </button>
                                    )}
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum = Math.max(1, currentPage - 2) + i;
                                        if (pageNum > totalPages) return null;
                                        return (
                                            <button 
                                                key={pageNum} 
                                                className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
                                                onClick={() => setCurrentPage(pageNum)}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                    {currentPage < totalPages && (
                                        <button className="page-btn" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>
                                            Next &rarr;
                                        </button>
                                    )}
                                </div>
                            )}
                        </section>
                    )}

                    {/* MODULE 2: AI MATCH ENGINE */}
                    {activeView === 'ai-page' && (
                        <section className="page-view active-view">
                            <div className="section-title">
                                <h2>Smart Squad AI Matching & Career Advisor Engine</h2>
                                <p>Calculates precision suitability using CV credentials, project depth, CGPA verification, and branch constraints across all 1,008 openings.</p>
                            </div>

                            <div className="card" style={{ border: '2px solid #c7d2fe', background: 'linear-gradient(180deg, #ffffff 0%, #f5f3ff 100%)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <div>
                                        <h3 style={{ margin: 0, border: 'none', padding: 0, color: 'var(--primary-dark)' }}>Neural Placement Predictor</h3>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginTop: '0.3rem' }}>
                                            Evaluates projects, certifications, GitHub readiness, and branch benchmarks.
                                        </p>
                                    </div>
                                    <span className="badge" style={{ background: 'var(--primary)', color: 'white' }}>AI Active</span>
                                </div>

                                <div className="grid-2">
                                    <div className="form-group">
                                        <label>Target Domain Preference</label>
                                        <select value={aiCareerGoal} onChange={e => setAiCareerGoal(e.target.value)}>
                                            <option value="ai-ds">AI, Deep Learning & Big Data</option>
                                            <option value="cse">Core Software, Web3 & Cloud Systems</option>
                                            <option value="it">Cloud Infrastructure & Full Stack</option>
                                            <option value="ece">Embedded Systems, VLSI & IoT</option>
                                            <option value="eee">Power Electronics & Smart Grid</option>
                                            <option value="mech">Robotics, CAD & Thermal Automation</option>
                                            <option value="civil">Structural & Smart City Engineering</option>
                                            <option value="chem">Process Simulation & Petrochemicals</option>
                                            <option value="aero">Aerodynamics, Propulsion & CFD</option>
                                            <option value="robotics">Autonomous Navigation & ROS</option>
                                            <option value="biotech">Genomics & Bio-Computation</option>
                                            <option value="metallurgy">Materials & Failure Analysis</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Target Offer Type</label>
                                        <select value={aiPreferredMode} onChange={e => setAiPreferredMode(e.target.value)}>
                                            <option value="all">Any Offer / Max Opportunity</option>
                                            <option value="Internship">Internship Priority</option>
                                            <option value="Full-Time">Direct Full-Time Placement</option>
                                        </select>
                                    </div>
                                </div>

                                <button 
                                    className="btn" 
                                    style={{ width: '100%', padding: '1rem', fontSize: '1rem', background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}
                                    onClick={runAISuggestionEngine}
                                >
                                    ✨ Run AI Scoring Over 1,008+ Ingested Openings
                                </button>

                                {showAiOutput && (
                                    <div style={{ marginTop: '2rem' }}>
                                        <h4 style={{ color: 'var(--primary-dark)', marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: 700 }}>
                                            ✨ AI Neural Ranking for {candidateCV.branchName}
                                        </h4>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '1.5rem' }}>
                                            Analyzed <strong>1,008 live choices</strong> for <strong>{authUser.uniqueId}</strong> using verified CGPA ({candidateCV.cgpa}) and core tech stack.
                                        </p>
                                        <div className="grid-3" style={{ marginBottom: 0 }}>
                                            {aiSuggestions.map(item => (
                                                <div key={item.id} className="card" style={{ border: '2px solid #818cf8' }}>
                                                    <div>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                                            <span className="badge" style={{ background: 'var(--primary)', color: 'white' }}>Top AI Pick</span>
                                                            <span className="badge pass" style={{ fontSize: '0.85rem' }}>{item.precision.matchPercentage}% Fit</span>
                                                        </div>
                                                        <h4 style={{ color: 'var(--text-heading)', fontSize: '1.1rem', marginBottom: '0.3rem' }}>{item.title}</h4>
                                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}><strong>{item.company}</strong> • {item.location}</p>
                                                        <p style={{ fontSize: '0.85rem', marginBottom: '0.4rem' }}><strong>Comp:</strong> ₹{item.stipend.toLocaleString('en-IN')}/mo • <strong>Portal:</strong> {item.sourcePortal}</p>
                                                    </div>
                                                    <div className="btn-group">
                                                        <button className="btn btn-outline" onClick={() => setDetailsModalJob(item)}>Inspect Score</button>
                                                        <a href={item.applyUrl} target="_blank" rel="noopener noreferrer" className="btn" style={{ background: '#4f46e5' }}>Apply Now ↗</a>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {/* MODULE 3: COMPLETE CV & BRANCH PROFILE */}
                    {activeView === 'profile-page' && (
                        <section className="page-view active-view">
                            <div className="section-title">
                                <h2>Engineering Branch & Full CV Data Setup</h2>
                                <p>Enter your comprehensive resume credentials to unlock high-precision qualification matching across 1000+ listings.</p>
                            </div>

                            <div className="grid-2">
                                <div className="card">
                                    <h3>CV & Academic Profile Data</h3>
                                    <form onSubmit={handleSaveCVProfile}>
                                        <div className="form-group">
                                            <label htmlFor="user-branch">Select Engineering Branch</label>
                                            <select id="user-branch" name="user-branch" defaultValue={candidateCV.branch} key={candidateCV.branch} required>
                                                <option value="ai-ds">Artificial Intelligence & Data Science (AI & DS)</option>
                                                <option value="cse">Computer Science & Engineering (CSE)</option>
                                                <option value="it">Information Technology (IT)</option>
                                                <option value="ece">Electronics & Communication Engineering (ECE)</option>
                                                <option value="eee">Electrical & Electronics Engineering (EEE)</option>
                                                <option value="mech">Mechanical Engineering (MECH)</option>
                                                <option value="civil">Civil Engineering (CIVIL)</option>
                                                <option value="chem">Chemical Engineering (CHEM)</option>
                                                <option value="aero">Aerospace / Aeronautical Engineering (AERO)</option>
                                                <option value="robotics">Robotics & Mechatronics (ROBOTICS)</option>
                                                <option value="biotech">Biotechnology Engineering (BIOTECH)</option>
                                                <option value="metallurgy">Metallurgical & Materials Engineering (MME)</option>
                                            </select>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                            <div className="form-group">
                                                <label>Current CGPA (0 - 10)</label>
                                                <input type="number" id="cgpa" name="cgpa" step="0.01" min="0" max="10" defaultValue={candidateCV.cgpa} required />
                                            </div>
                                            <div className="form-group">
                                                <label>Graduation Year</label>
                                                <input type="number" id="grad-year" name="grad-year" defaultValue={candidateCV.year} required />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Technical Stack & Skills (Comma separated)</label>
                                            <input type="text" id="skills" name="skills" defaultValue={candidateCV.skills.join(", ")} required />
                                        </div>
                                        <div className="form-group">
                                            <label>Past Internships / Work Experience (Count)</label>
                                            <input type="number" id="cv-internships" name="cv-internships" min="0" max="10" defaultValue={candidateCV.internships} />
                                        </div>
                                        <div className="form-group">
                                            <label>Major Projects Summary</label>
                                            <textarea id="cv-projects" name="cv-projects" rows={2} defaultValue={candidateCV.projects}></textarea>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                            <div className="form-group">
                                                <label>GitHub / Portfolio Link</label>
                                                <input type="url" id="cv-github" name="cv-github" defaultValue={candidateCV.github} />
                                            </div>
                                            <div className="form-group">
                                                <label>Certifications</label>
                                                <input type="text" id="cv-certifications" name="cv-certifications" defaultValue={candidateCV.certifications} />
                                            </div>
                                        </div>
                                        <button className="btn" type="submit" style={{ width: '100%', padding: '0.8rem' }}>
                                            Save CV & Recalibrate 1,008 Matches
                                        </button>
                                    </form>
                                </div>

                                <div className="card">
                                    <h3>Parsed Candidate Resume Card <span className="badge pass">Verified</span></h3>
                                    <div className="item-row">
                                        <div>
                                            <strong style={{ fontSize: '1.1rem', color: 'var(--text-heading)' }}>{candidateCV.branchName}</strong>
                                            <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginTop: '0.2rem' }}>
                                                Batch: <span>{candidateCV.year}</span> | Validated CGPA: <strong style={{ color: 'var(--primary)' }}>{candidateCV.cgpa.toFixed(2)}</strong>
                                            </p>
                                        </div>
                                        <span className="badge pass">Ready for 1,008 Pool</span>
                                    </div>
                                    <div style={{ margin: '1.25rem 0' }}>
                                        <label style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-heading)' }}>Verified Technical Stack</label>
                                        <div className="tag-list" style={{ marginTop: '0.4rem' }}>
                                            {candidateCV.skills.map(s => <span key={s} className="tag">{s}</span>)}
                                        </div>
                                    </div>
                                    <div style={{ margin: '1.25rem 0' }}>
                                        <label style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-heading)' }}>CV Highlights & Credentials</label>
                                        <div className="item-row" style={{ paddingTop: '0.4rem' }}>
                                            <span>Past Internships Logged</span>
                                            <strong>{candidateCV.internships} Completed</strong>
                                        </div>
                                        <div className="item-row">
                                            <span>Active Certifications</span>
                                            <span className="badge" style={{ background: '#e0f2fe', color: 'var(--primary)' }}>
                                                {candidateCV.certifications || "None added"}
                                            </span>
                                        </div>
                                        <div className="item-row">
                                            <span>Portfolio Repository</span>
                                            <a href={candidateCV.github} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600, color: 'var(--accent)', textDecoration: 'none' }}>
                                                {candidateCV.github.replace('https://', '')} ↗
                                            </a>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: '0.8rem', background: '#eff6ff', padding: '0.85rem', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                                        <strong style={{ color: 'var(--primary)', fontSize: '0.85rem' }}>Ingestion Status:</strong>
                                        <p style={{ fontSize: '0.8rem', color: '#1e3a8a', marginTop: '0.2rem' }}>
                                            All 1,008 live opportunities automatically synchronized to your branch curriculum.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* MODULE 4: CONNECTED PORTALS */}
                    {activeView === 'portals-page' && (
                        <section className="page-view active-view">
                            <div className="section-title">
                                <h2>Connected Portal Directory (30+ Platforms)</h2>
                                <p>Integrated ingestion gateways pulling active engineering vacancies worldwide.</p>
                            </div>
                            <div className="grid-4">
                                {portalsDirectory.map(p => (
                                    <div key={p.name} className="card" style={{ padding: '1.25rem' }}>
                                        <div style={{ marginBottom: '1rem' }}>
                                            <span className="badge" style={{ marginBottom: '0.5rem' }}>{p.cat}</span>
                                            <h4 style={{ fontSize: '1.05rem', marginBottom: '0.2rem', color: 'var(--text-heading)' }}>{p.name}</h4>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>{p.desc}</p>
                                        </div>
                                        <a href={p.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.4rem' }}>
                                            Visit Gateway ↗
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* MODULE 5: ALUMNI MENTORSHIP & REFERRAL NETWORK */}
                    {activeView === 'alumni-page' && (
                        <section className="page-view active-view">
                            <div className="section-title">
                                <h2>Alumni Mentorship & Referral Network</h2>
                                <p>Connect with verified college alumni for direct 1-on-1 mentorship, domain guidance, and fast-tracked hiring referrals to targeted companies.</p>
                            </div>

                            <div className="card" style={{ marginBottom: '2.25rem', background: 'linear-gradient(to right, #ffffff, #f8fafc)', borderLeft: '4px solid var(--primary)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                                    <div>
                                        <h3 style={{ border: 'none', padding: 0, marginBottom: '0.35rem', fontSize: '1.25rem' }}>Book a Branch Mock Sprint (Mentorship)</h3>
                                        <p style={{ fontSize: '0.92rem', color: 'var(--text-main)' }}>Schedule a 30-min simulation with an alum currently working in your target domain.</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                        <select 
                                            value={mockBranchSelect}
                                            onChange={e => setMockBranchSelect(e.target.value)}
                                            style={{ padding: '0.65rem', border: '1.5px solid var(--border-light)', borderRadius: '8px', fontSize: '0.88rem', fontWeight: 500, outline: 'none' }}
                                        >
                                            <option>AI, Machine Learning & Algorithms (AI & DS)</option>
                                            <option>DSA / Distributed Backend (CSE/IT)</option>
                                            <option>VLSI, FPGA & Digital Design (ECE)</option>
                                            <option>Power Systems & EV Inverters (EEE)</option>
                                            <option>Thermal CAD & FEA Analysis (Mech)</option>
                                            <option>Structural Analysis & STAAD (Civil)</option>
                                            <option>Autonomous Navigation & ROS (Robotics)</option>
                                            <option>Aerodynamics CFD & Propulsion (Aero)</option>
                                            <option>Chemical Unit Operations (Chem)</option>
                                            <option>Genomic Sequencing & Bio-Pipelines (Biotech)</option>
                                            <option>Materials Characterization (Metallurgy)</option>
                                        </select>
                                        <button className="btn" onClick={() => alert(`Mock interview requested! Mentorship notification dispatched to your mentor via: ${authUser.uniqueId}`)}>
                                            Book Simulation
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid-2">
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', color: 'var(--text-heading)', fontWeight: 800, marginBottom: '1.25rem' }}>Alumni Directory</h3>
                                    <div className="toolbar" style={{ padding: '0.85rem', marginBottom: '1.25rem' }}>
                                        <select style={{ flex: 1 }} value={alumCompanyFilter} onChange={e => setAlumCompanyFilter(e.target.value)}>
                                            <option value="all">All Companies</option>
                                            <option value="Google">Google</option>
                                            <option value="Texas Instruments">Texas Instruments</option>
                                            <option value="Tata Motors">Tata Motors</option>
                                            <option value="Qualcomm Technologies">Qualcomm</option>
                                            <option value="L&T Heavy Tech">L&T Heavy Tech</option>
                                            <option value="Siemens Smart Grid">Siemens</option>
                                            <option value="Airbus Engineering Hub">Airbus</option>
                                        </select>
                                        <select style={{ flex: 1 }} value={alumBranchFilter} onChange={e => setAlumBranchFilter(e.target.value)}>
                                            <option value="all">All Disciplines</option>
                                            <option value="AI & DS">AI & DS</option>
                                            <option value="CSE">CSE</option>
                                            <option value="ECE">ECE</option>
                                            <option value="EEE">EEE</option>
                                            <option value="Mech">Mechanical</option>
                                            <option value="Civil">Civil</option>
                                            <option value="Aero">Aerospace</option>
                                            <option value="Robotics">Robotics</option>
                                        </select>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {filteredAlumni.map(alum => (
                                            <div key={alum.id} className="card" style={{ flexDirection: 'row', alignItems: 'center', padding: '1.1rem' }}>
                                                <div style={{ flex: 1 }}>
                                                    <strong style={{ fontSize: '1.05rem', color: 'var(--text-heading)' }}>{alum.name}</strong> 
                                                    <span className="badge" style={{ fontSize: '0.7rem', marginLeft: '0.4rem' }}>Class of &apos;{alum.batch}</span>
                                                    <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', marginTop: '0.35rem', fontWeight: 500 }}>
                                                        {alum.role} @ <strong style={{ color: 'var(--primary)' }}>{alum.company}</strong>
                                                    </p>
                                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginTop: '0.15rem' }}>Dept: {alum.branch}</p>
                                                </div>
                                                <button className="btn" style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem' }} onClick={() => setReferralModalTarget({ alumName: alum.name, company: alum.company })}>
                                                    Request Referral
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <div className="card" style={{ marginBottom: '1.5rem' }}>
                                        <h3 style={{ fontSize: '1.15rem' }}>Referral Pipeline Tracker</h3>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '1.25rem' }}>Track the real-time status of your internal alumni referral submissions.</p>
                                        
                                        <div className="item-row" style={{ flexDirection: 'column', alignItems: 'stretch', border: '1.5px solid var(--border-light)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.25rem', background: '#f8fafc' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                <div style={{ fontWeight: 700, color: 'var(--text-heading)', fontSize: '1.05rem' }}>Amazon - <span style={{ fontWeight: 500 }}>SDE Intern</span></div>
                                                <span className="badge pass">Referred</span>
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '1.25rem' }}>Alum Sponsor: R. Sharma (&apos;20)</div>
                                            <div className="pipeline-tracker">
                                                <div className="pipeline-step completed"><div className="step-dot">✓</div><span>Sent</span></div>
                                                <div className="pipeline-step completed"><div className="step-dot">✓</div><span>Screened</span></div>
                                                <div className="pipeline-step completed"><div className="step-dot">✓</div><span>Submitted</span></div>
                                                <div className="pipeline-step"><div className="step-dot">4</div><span>Interview</span></div>
                                            </div>
                                        </div>

                                        <div className="item-row" style={{ flexDirection: 'column', alignItems: 'stretch', border: '1.5px solid var(--border-light)', borderRadius: '12px', padding: '1.25rem', background: '#f8fafc' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                <div style={{ fontWeight: 700, color: 'var(--text-heading)', fontSize: '1.05rem' }}>Qualcomm - <span style={{ fontWeight: 500 }}>Embedded Trainee</span></div>
                                                <span className="badge warn">Under Review</span>
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '1.25rem' }}>Alum Sponsor: P. Mehta (&apos;22)</div>
                                            <div className="pipeline-tracker">
                                                <div className="pipeline-step completed"><div className="step-dot">✓</div><span>Sent</span></div>
                                                <div className="pipeline-step active"><div className="step-dot">2</div><span>Screened</span></div>
                                                <div className="pipeline-step"><div className="step-dot">3</div><span>Submitted</span></div>
                                                <div className="pipeline-step"><div className="step-dot">4</div><span>Interview</span></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* MODULE 6: REJECTION ANALYZER & REMEDIAL ANALYTICS HUB */}
                    {activeView === 'rejection-page' && (
                        <section className="page-view active-view">
                            <div className="section-title">
                                <h2>Rejection Diagnostics & Remedial Analytics Hub</h2>
                                <p>Detailed analysis of student rejection points and macro cohort stats (Applied, Selected, Rejected) to help colleges understand exactly where students are failing and provide targeted support.</p>
                            </div>

                            <div className="card" style={{ marginBottom: '2.25rem', border: '2px solid var(--border-light)' }}>
                                <h3 style={{ color: 'var(--text-heading)', fontSize: '1.25rem' }}>Placement Cell Cohort Analytics (Macro Summary)</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
                                    <div className="stat-box"><h4>1,205</h4><p>Total Applied</p></div>
                                    <div className="stat-box"><h4 style={{ color: 'var(--danger)' }}>991</h4><p>Total Rejected</p></div>
                                    <div className="stat-box"><h4 style={{ color: 'var(--warning)' }}>320</h4><p>Tech Cleared</p></div>
                                    <div className="stat-box"><h4 style={{ color: 'var(--success)' }}>214</h4><p>Total Selected</p></div>
                                </div>

                                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem' }}>Where Students Are Dropping (Stage-Wise Heatmap)</h4>
                                <div className="heatmap-grid" style={{ marginBottom: '1.25rem' }}>
                                    <div className="heat-cell heat-header">Engineering Branch</div>
                                    <div className="heat-cell heat-header">OA Stage</div>
                                    <div className="heat-cell heat-header">Tech R1</div>
                                    <div className="heat-cell heat-header">Sys / Domain</div>
                                    <div className="heat-cell heat-header">HR Round</div>
                                    
                                    <div className="heat-cell heat-header">AI & DS / CSE</div>
                                    <div className="heat-cell heat-med">22% Drop</div>
                                    <div className="heat-cell heat-high">45% Drop</div>
                                    <div className="heat-cell heat-med">28% Drop</div>
                                    <div className="heat-cell heat-low">5% Drop</div>

                                    <div className="heat-cell heat-header">ECE & VLSI</div>
                                    <div className="heat-cell heat-high">42% Drop</div>
                                    <div className="heat-cell heat-med">30% Drop</div>
                                    <div className="heat-cell heat-low">15% Drop</div>
                                    <div className="heat-cell heat-low">13% Drop</div>

                                    <div className="heat-cell heat-header">EEE (Electrical)</div>
                                    <div className="heat-cell heat-high">39% Drop</div>
                                    <div className="heat-cell heat-med">32% Drop</div>
                                    <div className="heat-cell heat-low">19% Drop</div>
                                    <div className="heat-cell heat-low">10% Drop</div>

                                    <div className="heat-cell heat-header">Mechanical & Auto</div>
                                    <div className="heat-cell heat-med">35% Drop</div>
                                    <div className="heat-cell heat-med">38% Drop</div>
                                    <div className="heat-cell heat-low">12% Drop</div>
                                    <div className="heat-cell heat-low">15% Drop</div>

                                    <div className="heat-cell heat-header">Civil & Infra</div>
                                    <div className="heat-cell heat-med">28% Drop</div>
                                    <div className="heat-cell heat-med">41% Drop</div>
                                    <div className="heat-cell heat-low">18% Drop</div>
                                    <div className="heat-cell heat-low">13% Drop</div>

                                    <div className="heat-cell heat-header">Aero & Robotics</div>
                                    <div className="heat-cell heat-med">31% Drop</div>
                                    <div className="heat-cell heat-high">44% Drop</div>
                                    <div className="heat-cell heat-low">15% Drop</div>
                                    <div className="heat-cell heat-low">10% Drop</div>
                                </div>
                                <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', background: '#f8fafc', padding: '0.9rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                                    <strong>College Support Action Plan:</strong> Analytics indicate 42% of ECE applicants are repeatedly rejected at the OA stage. The institution should organize a specialized &quot;Verilog Timing & Finite State Machines&quot; support bootcamp to address this specific drop-off.
                                </p>
                            </div>

                            <div className="grid-2">
                                <div className="card">
                                    <h3 style={{ fontSize: '1.15rem' }}>Particular Student Rejection Log</h3>
                                    <table>
                                        <thead>
                                            <tr><th>Target Company</th><th>Drop Stage</th><th>Identified Rejection Point</th></tr>
                                        </thead>
                                        <tbody>
                                            <tr><td>Alpha Tech</td><td><span className="badge fail">Tech Round 2</span></td><td style={{ fontSize: '0.85rem', fontWeight: 500 }}>Distributed System Design & SQL Indexing</td></tr>
                                            <tr><td>Silicon Wave</td><td><span className="badge fail">Online Assess</span></td><td style={{ fontSize: '0.85rem', fontWeight: 500 }}>Verilog state machine timing setup violations</td></tr>
                                            <tr><td>FinServe Group</td><td><span className="badge warn">System Design</span></td><td style={{ fontSize: '0.85rem', fontWeight: 500 }}>Dynamic programming (Knapsack variations)</td></tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div className="card" style={{ background: '#f8fafc', border: '1.5px solid var(--border-light)' }}>
                                    <h3 style={{ color: 'var(--primary-dark)', fontSize: '1.15rem' }}>Automated Remedial Learning Path</h3>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '1.25rem' }}>Custom remedial modules assigned to your profile based on your exact rejection points.</p>
                                    
                                    <div className="item-row" style={{ background: 'white', borderRadius: '10px', padding: '1.1rem', marginBottom: '0.75rem', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-soft)' }}>
                                        <div>
                                            <strong style={{ color: 'var(--text-heading)', fontSize: '0.95rem' }}>Distributed Systems & DB Indexing</strong>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--danger)', fontWeight: 600, marginTop: '0.2rem' }}>Addresses rejection from: Alpha Tech</p>
                                        </div>
                                        <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }} onClick={() => alert("Launching Distributed Systems Interactive Lab...")}>Launch Lab</button>
                                    </div>

                                    <div className="item-row" style={{ background: 'white', borderRadius: '10px', padding: '1.1rem', marginBottom: '0.75rem', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-soft)' }}>
                                        <div>
                                            <strong style={{ color: 'var(--text-heading)', fontSize: '0.95rem' }}>DP Pattern Recognition Masterclass</strong>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--warning)', fontWeight: 600, marginTop: '0.2rem' }}>Addresses rejection from: FinServe</p>
                                        </div>
                                        <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }} onClick={() => alert("Launching Dynamic Programming Masterclass...")}>Launch Lab</button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

            {/* ===== FLOATING AI CHATBOT WIDGET ===== */}
            <div id="ai-chat-widget">
                {isChatOpen && (
                    <div className="chat-panel">
                        <div className="chat-header">
                            <div>
                                <h4>🤖 Smart Squad AI Advisor</h4>
                                <span className="chat-header-sub">Career • Placement • Internship Expert</span>
                                <span className="chat-header-gemini">⚡ Powered by Google Gemini</span>
                            </div>
                            <button className="chat-header-close" onClick={() => setIsChatOpen(false)}>✕</button>
                        </div>

                        <div className="chat-messages">
                            {chatMessages.map((msg, i) => (
                                <div key={i} className={`chat-bubble ${msg.role}`}>
                                    {msg.text}
                                </div>
                            ))}
                            {isChatLoading && (
                                <div className="chat-bubble model">
                                    <div className="typing-indicator">
                                        <div className="typing-dot"></div>
                                        <div className="typing-dot"></div>
                                        <div className="typing-dot"></div>
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {chatMessages.length <= 1 && (
                            <div className="chat-suggestions">
                                {[
                                    "💰 Expected salary for CSE?",
                                    "📄 Resume tips for freshers",
                                    "🏢 How to crack campus placements?",
                                    "🎯 Best skills for ECE branch?"
                                ].map(q => (
                                    <button
                                        key={q}
                                        className="chat-chip"
                                        onClick={() => handleChatSuggestion(q.replace(/^[\S]+ /, '').trim())}
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        )}

                        <form onSubmit={handleChatSubmit} className="chat-input-area">
                            <input
                                type="text"
                                placeholder="Ask about jobs, placements, interviews..."
                                value={chatInput}
                                onChange={e => setChatInput(e.target.value)}
                                disabled={isChatLoading}
                                autoFocus
                            />
                            <button
                                type="submit"
                                className="chat-send-btn"
                                disabled={isChatLoading || !chatInput.trim()}
                            >
                                {isChatLoading ? '⏳' : '➤'}
                            </button>
                        </form>
                    </div>
                )}

                <button
                    className={`chat-fab ${isChatOpen ? 'open' : ''}`}
                    onClick={() => setIsChatOpen(o => !o)}
                    title="AI Career Advisor — Ask anything!"
                >
                    {isChatOpen ? '✕' : '💬'}
                    {!isChatOpen && <span className="chat-badge">AI</span>}
                </button>
            </div>

            {/* DETAILS MODAL */}
            {detailsModalJob && (
                <div className="modal" onClick={(e: any) => e.target.className === 'modal' && setDetailsModalJob(null)}>
                    <div className="modal-content">
                        <span className="close-btn" onClick={() => setDetailsModalJob(null)}>&times;</span>
                        <h2 style={{ color: 'var(--text-heading)', marginBottom: '0.4rem', fontSize: '1.45rem', fontWeight: 800 }}>{detailsModalJob.title}</h2>
                        <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', marginBottom: '1.25rem' }}>
                            <strong>{detailsModalJob.company}</strong> • {detailsModalJob.location} • Via: <strong>{detailsModalJob.sourcePortal}</strong>
                        </p>

                        {(() => {
                            const matchData = calculatePrecisionMatch(candidateCV, detailsModalJob);
                            return (
                                <>
                                    <div style={{ background: '#f8fafc', border: '1.5px solid var(--border-light)', padding: '1.25rem', borderRadius: '10px', marginBottom: '1.25rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                                            <strong style={{ color: 'var(--text-heading)' }}>Overall CV & Branch Fit Score:</strong>
                                            <span className={`badge ${matchData.matchPercentage >= 75 ? 'pass' : 'warn'}`} style={{ fontSize: '0.95rem' }}>
                                                {matchData.matchPercentage}% Compatibility
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ color: 'var(--text-main)' }}>Academic CGPA Threshold (Min: {detailsModalJob.minCGPA}):</span>
                                            <span className={`badge ${matchData.isCGPAEligible ? 'pass' : 'fail'}`}>
                                                {matchData.isCGPAEligible ? `Eligible (${candidateCV.cgpa})` : 'Ineligible'}
                                            </span>
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '1.25rem' }}>
                                        <h4 style={{ fontSize: '1rem', marginBottom: '0.4rem', color: 'var(--text-heading)' }}>Skills Match Breakdown</h4>
                                        <div className="tag-list" style={{ marginBottom: '0.85rem' }}>
                                            {matchData.matchedSkills.length > 0 ? (
                                                matchData.matchedSkills.map(s => (
                                                    <span key={s} className="tag" style={{ background: '#dcfce7', color: '#047857', borderColor: '#a7f3d0' }}>
                                                        ✓ {s}
                                                    </span>
                                                ))
                                            ) : (
                                                <span style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>No direct skill match</span>
                                            )}
                                        </div>
                                        {matchData.missingSkills.length > 0 && (
                                            <>
                                                <p style={{ fontSize: '0.85rem', color: 'var(--danger)', fontWeight: 600, marginBottom: '0.4rem' }}>Missing Prerequisites:</p>
                                                <div className="tag-list">
                                                    {matchData.missingSkills.map(s => (
                                                        <span key={s} className="tag" style={{ background: '#fef2f2', color: '#b91c1c', borderColor: '#fecaca' }}>
                                                            ✕ {s}
                                                        </span>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </>
                            );
                        })()}

                        <a href={detailsModalJob.applyUrl} target="_blank" rel="noopener noreferrer" className="btn" style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}>
                            Launch Application on {detailsModalJob.sourcePortal} ↗
                        </a>
                    </div>
                </div>
            )}

            {/* REFERRAL MODAL */}
            {referralModalTarget && (
                <div className="modal" onClick={(e: any) => e.target.className === 'modal' && setReferralModalTarget(null)}>
                    <div className="modal-content" style={{ maxWidth: '500px' }}>
                        <span className="close-btn" onClick={() => setReferralModalTarget(null)}>&times;</span>
                        <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-heading)' }}>Request Mentorship & Referral</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '1.25rem' }}>
                            Sending candidate portfolio summary to <strong style={{ color: 'var(--primary)' }}>{referralModalTarget.alumName ? referralModalTarget.alumName : `an Alumnus at ${referralModalTarget.company}`}</strong>.
                        </p>
                        
                        <div style={{ background: 'rgba(255,255,255,0.05)', border: '1.5px solid var(--border-light)', padding: '1.25rem', borderRadius: '10px', marginBottom: '1.25rem' }}>
                            <p style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8', marginBottom: '0.65rem', letterSpacing: '0.5px' }}>Candidate Payload Verification</p>
                            <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
                                <div><strong style={{ color: 'var(--text-heading)' }}>Student ID:</strong> {authUser.uniqueId}</div>
                                <div><strong style={{ color: 'var(--text-heading)' }}>Branch:</strong> {candidateCV.branchName}</div>
                                <div><strong style={{ color: 'var(--text-heading)' }}>Verified CGPA:</strong> {candidateCV.cgpa}</div>
                                <div style={{ marginTop: '0.4rem' }}><strong style={{ color: 'var(--text-heading)' }}>Tech Stack:</strong></div>
                                <div style={{ color: 'var(--primary)', fontWeight: 600 }}>{candidateCV.skills.join(", ")}</div>
                                <div style={{ marginTop: '0.4rem' }}><strong style={{ color: 'var(--text-heading)' }}>Portfolio:</strong> {candidateCV.github.replace('https://', '')}</div>
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label>Add a personal note for the Alumnus</label>
                            <textarea rows={3} placeholder="Hello! I would love to connect for mentorship and referral consideration for the open role..."></textarea>
                        </div>
                        
                        <button 
                            className="btn" 
                            style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem' }} 
                            onClick={() => {
                                alert(`Candidate summary for ${authUser.uniqueId} successfully dispatched to the Alumnus!`);
                                setReferralModalTarget(null);
                            }}
                        >
                            Dispatch Referral to Alumnus Inbox
                        </button>
                    </div>
                </div>
            )}

            {/* ── FEATURE 3: SAVED JOBS PAGE ── */}
            {activeView === 'saved-page' && (
                <section className="page-view active-view">
                    <div className="section-title">
                        <h2>⭐ Saved Jobs ({savedJobs.length})</h2>
                        <p>Your bookmarked opportunities, ready to apply whenever you are.</p>
                    </div>
                    {savedJobs.length === 0 ? (
                        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                            <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>☆</p>
                            <p style={{ color: 'var(--text-main)' }}>No saved jobs yet. Click the ☆ on any job card to bookmark it!</p>
                        </div>
                    ) : (
                        <div className="grid-3">
                            {savedJobs.map(item => {
                                const m = calculatePrecisionMatch(candidateCV, item);
                                const bc = m.matchPercentage >= 80 ? 'pass' : m.matchPercentage >= 60 ? 'warn' : 'fail';
                                return (
                                    <div key={item.id} className="card">
                                        <div>
                                            <h3 style={{ fontSize: '1rem' }}>{item.title} <span className={`badge ${bc}`}>{m.matchPercentage}%</span></h3>
                                            <p style={{ fontSize: '0.83rem', color: 'var(--text-main)', marginBottom: '0.4rem' }}><strong>{item.company}</strong> · {item.location}</p>
                                            <p style={{ fontSize: '0.8rem' }}>₹{item.stipend.toLocaleString('en-IN')}/mo · CGPA {item.minCGPA}+</p>
                                        </div>
                                        <div className="btn-group">
                                            <button className="btn btn-outline" style={{ fontSize: '0.78rem' }} onClick={() => toggleBookmark(item.id)}>🗑️ Remove</button>
                                            {/* Tracker removed */}
                                            <a href={item.applyUrl} target="_blank" rel="noopener noreferrer" className="btn" style={{ fontSize: '0.78rem' }}>Apply ↗</a>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            )}

            {/* ── FEATURE 4: APPLICATION TRACKER + SWIPE-TO-APPLY (UNIFIED PAGE) ── */}



            {/* ── FEATURE 8: 90-DAY ROADMAP ── */}
            {activeView === 'roadmap-page' && (
                <section className="page-view active-view">
                    <div className="section-title">
                        <h2>🗺️ 90-Day Placement Prep Roadmap</h2>
                        <p>A structured week-by-week action plan tailored to your engineering branch.</p>
                    </div>
                    <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem 1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                            <select value={roadmapBranch} onChange={e => { setRoadmapBranch(e.target.value); }} style={{ width: 280 }}>
                                {Object.entries(branchNamesMap).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                            </select>
                            <div style={{ flex: 1, minWidth: 200 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-main)', marginBottom: '0.3rem' }}>
                                    <span>Progress</span><span><strong style={{ color: 'var(--primary)' }}>{completedTasks}</strong>/{totalTasks} tasks · {roadmapPct}%</span>
                                </div>
                                <div style={{ height: 10, background: 'var(--border-light)', borderRadius: 5, overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${roadmapPct}%`, background: 'linear-gradient(90deg, var(--primary), var(--accent))', borderRadius: 5, transition: 'width 0.6s ease' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {(roadmaps[roadmapBranch] || roadmaps['cse']).map(({ week, tasks }, wi) => (
                            <div key={week} className="card" style={{ padding: '1.25rem' }}>
                                <h3 style={{ marginBottom: '0.75rem', padding: 0, border: 'none', fontSize: '0.95rem', color: 'var(--primary)' }}>📅 {week}</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                    {tasks.map((task, ti) => {
                                        const key = `${roadmapBranch}-${wi}-${ti}`;
                                        const done = roadmapChecks.has(key);
                                        return (
                                            <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', padding: '0.45rem 0.5rem', borderRadius: 8, transition: 'background 0.15s', background: done ? '#dcfce7' : 'transparent' }}>
                                                <input type="checkbox" checked={done} onChange={() => toggleRoadmapCheck(key)} style={{ width: 16, height: 16, accentColor: 'var(--primary)' }} />
                                                <span style={{ fontSize: '0.85rem', color: done ? '#047857' : 'var(--text-heading)', textDecoration: done ? 'line-through' : 'none', transition: 'all 0.2s' }}>{task}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* ── FEATURE 7: COMPANY LEADERBOARD (ENHANCED) ── */}
            {activeView === 'leaderboard-page' && (
                <section className="page-view active-view">
                    <div className="section-title">
                        <h2>🏆 Top 20 Company Leaderboard</h2>
                        <p>Companies ranked by job listings, alumni network strength, and average compensation.</p>
                    </div>
                    {/* Controls */}
                    <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '1.25rem', flexDirection: 'row', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', flex: 1 }}>
                            {['all', 'cse', 'ai-ds', 'ece', 'eee', 'mech', 'civil'].map(b => (
                                <button key={b} onClick={() => setLeaderboardBranch(b)} style={{ padding: '0.35rem 0.8rem', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700, background: leaderboardBranch === b ? 'var(--primary)' : 'var(--border-light)', color: leaderboardBranch === b ? 'white' : 'var(--text-main)', transition: 'all 0.15s' }}>
                                    {b === 'all' ? 'All Branches' : (branchNamesMap as any)[b]?.split(' ')[0] || b.toUpperCase()}
                                </button>
                            ))}
                        </div>
                        <select value={leaderboardSort} onChange={e => setLeaderboardSort(e.target.value as any)} style={{ fontSize: '0.82rem', padding: '0.35rem 0.65rem', borderRadius: 8, border: '1.5px solid var(--border-light)', color: 'var(--text-heading)', fontWeight: 600 }}>
                            <option value="score">🏆 Sort by Rank Score</option>
                            <option value="jobs">💼 Sort by Job Count</option>
                            <option value="alums">🤝 Sort by Alumni Count</option>
                            <option value="salary">💰 Sort by Avg Salary</option>
                        </select>
                    </div>

                    <div className="card">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {[...leaderboard]
                                .sort((a, b) => {
                                    if (leaderboardSort === 'jobs') return b.jobs - a.jobs;
                                    if (leaderboardSort === 'alums') return b.alums - a.alums;
                                    if (leaderboardSort === 'salary') return b.avgStipend - a.avgStipend;
                                    return (b.jobs + b.alums * 3) - (a.jobs + a.alums * 3);
                                })
                                .map((co, idx) => {
                                    // Tier classification
                                    const tier = co.jobs > 80 ? {label:'Tier 1', color:'#4f46e5', bg:'#eef2ff'} : co.jobs > 40 ? {label:'Tier 2', color:'#0ea5e9', bg:'#f0f9ff'} : co.alums > 5 ? {label:'Core', color:'#10b981', bg:'#f0fdf4'} : {label:'Growing', color:'#f59e0b', bg:'#fffbeb'};
                                    return (
                                        <div key={co.name} className="item-row" style={{ padding: '0.85rem 1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1 }}>
                                                <span style={{
                                                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                                                    background: idx === 0 ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' : idx === 1 ? 'linear-gradient(135deg, #94a3b8, #64748b)' : idx === 2 ? 'linear-gradient(135deg, #d97706, #b45309)' : 'linear-gradient(135deg, #e2e8f0, #cbd5e1)',
                                                    color: idx < 3 ? 'white' : 'var(--text-main)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.88rem'
                                                }}>#{idx + 1}</span>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <div style={{ fontWeight: 700, color: 'var(--text-heading)', fontSize: '0.95rem' }}>{co.name}</div>
                                                        <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: tier.bg, color: tier.color, border: `1px solid ${tier.color}40` }}>{tier.label}</span>
                                                        {co.jobs > 50 && <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: '#dcfce7', color: '#047857', border: '1px solid #a7f3d040' }}>🟢 Hiring Now</span>}
                                                    </div>
                                                    <div style={{ width: '100%', height: 5, background: 'var(--border-light)', borderRadius: 3, marginTop: '0.35rem', overflow: 'hidden' }}>
                                                        <div style={{ height: '100%', width: `${(co.jobs / maxJobs) * 100}%`, background: 'linear-gradient(90deg, var(--primary), var(--accent))', borderRadius: 3, transition: 'width 0.8s ease' }} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.78rem', color: 'var(--text-main)', flexShrink: 0 }}>
                                                <div style={{ textAlign: 'center' }}>
                                                    <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1rem' }}>{co.jobs}</div>
                                                    <div style={{ fontSize: '0.65rem' }}>Jobs</div>
                                                </div>
                                                <div style={{ textAlign: 'center' }}>
                                                    <div style={{ fontWeight: 800, color: '#f59e0b', fontSize: '1rem' }}>{co.alums}</div>
                                                    <div style={{ fontSize: '0.65rem' }}>Alumni</div>
                                                </div>
                                                <div style={{ textAlign: 'center' }}>
                                                    <div style={{ fontWeight: 800, color: 'var(--success)', fontSize: '1rem' }}>₹{(co.avgStipend / 1000).toFixed(0)}K</div>
                                                    <div style={{ fontSize: '0.65rem' }}>Avg/mo</div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                </section>
            )}



            {/* ── HAI TOOL: AI MOCK INTERVIEW (Real Camera + Speech + Gemini) ── */}


            {/* ── FRAUD DETECTOR FEATURE ── */}
            {activeView === 'fraud-page' && (() => {
                const runFraudCheck = async () => {
                    setFraudLoading(true);
                    setFraudResult(null);
                    try {
                        let prompt = '';
                        if (fraudMode === 'paste') {
                            prompt = `You are a fraud detection expert for Indian internship/job/placement offers. Analyze this text and return ONLY a JSON object (no extra text): {"score": <trust score 0-100>, "verdict": "<Safe|Suspicious|Likely Fraud>", "flags": [<list of red flag strings found>], "tips": [<2-3 actionable verification tips>]}\n\nText to analyze:\n"${fraudText}"`;
                        } else {
                            prompt = `You are a fraud detection expert for Indian internship/job offers. Evaluate this offer and return ONLY a JSON object: {"score": <trust score 0-100>, "verdict": "<Safe|Suspicious|Likely Fraud>", "flags": [<red flag strings>], "tips": [<verification tips>]}\n\nOffer details:\nCompany: ${fraudCompany}\nRole: ${fraudRole}\nSalary/Stipend: ${fraudSalary}\nRecruiter email: ${fraudEmail}`;
                        }
                        const res = await fetch('/api/ai-chat', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ message: prompt, history: [] })
                        });
                        const data = await res.json();
                        try {
                            const cleaned = data.reply.replace(/```json|```/g, '').trim();
                            const parsed = JSON.parse(cleaned);
                            setFraudResult(parsed);
                        } catch (e) {
                            // Parse failure: generate a basic result
                            const isHighRisk = (fraudText + fraudEmail + fraudSalary).toLowerCase().includes('gmail') || fraudSalary > '80000';
                            setFraudResult({ score: isHighRisk ? 28 : 65, verdict: isHighRisk ? 'Suspicious' : 'Needs Verification', flags: ['Unable to parse full analysis - please review manually'], tips: ['Verify on official company website', 'Check company on LinkedIn', 'Call official company number'] });
                        }
                    } catch (e) {
                        setFraudResult({ score: 50, verdict: 'Needs Verification', flags: ['Analysis failed - check your connection'], tips: ['Verify company on official website', 'Check LinkedIn for job posting', 'Call company HR directly'] });
                    }
                    setFraudLoading(false);
                };

                const scoreColor = fraudResult ? (fraudResult.score >= 70 ? '#10b981' : fraudResult.score >= 40 ? '#f59e0b' : '#ef4444') : '#94a3b8';
                const verdictBg = fraudResult ? (fraudResult.score >= 70 ? '#f0fdf4' : fraudResult.score >= 40 ? '#fffbeb' : '#fef2f2') : 'white';

                return (
                    <section className="page-view active-view">
                        <div className="section-title">
                            <h2>🛡️ Internship & Job Fraud Detector</h2>
                            <p>Paste an offer letter, email, or enter company details to get an AI-powered trust score and red flag analysis.</p>
                        </div>

                        {/* Common red flags info */}
                        <div className="card" style={{ background: 'linear-gradient(135deg, #1e1b4b, #2d1b69)', color: 'white', border: 'none', marginBottom: '1.25rem', padding: '1.25rem 1.5rem' }}>
                            <h4 style={{ color: '#a5b4fc', marginBottom: '0.75rem', fontSize: '0.9rem' }}>🚨 Common Fraud Red Flags</h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {['Asks for money/fee', 'Gmail/Yahoo recruiter email', 'Salary too good to be true', 'No official website', 'WhatsApp-only hiring', 'Asks for Aadhar/PAN before joining', 'Vague job description', 'Company name misspelled'].map(flag => (
                                    <span key={flag} style={{ background: 'rgba(239,68,68,0.2)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.3)', padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600 }}>🚩 {flag}</span>
                                ))}
                            </div>
                        </div>

                        <div className="grid-2">
                            <div className="card">
                                {/* Mode toggle */}
                                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', background: 'var(--bg-body)', padding: '0.3rem', borderRadius: 10, width: 'fit-content' }}>
                                    <button onClick={() => setFraudMode('paste')} style={{ padding: '0.45rem 1.1rem', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem', background: fraudMode === 'paste' ? 'var(--primary)' : 'transparent', color: fraudMode === 'paste' ? 'white' : 'var(--text-main)' }}>📋 Paste Text</button>
                                    <button onClick={() => setFraudMode('manual')} style={{ padding: '0.45rem 1.1rem', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem', background: fraudMode === 'manual' ? 'var(--primary)' : 'transparent', color: fraudMode === 'manual' ? 'white' : 'var(--text-main)' }}>📝 Manual Entry</button>
                                </div>

                                {fraudMode === 'paste' ? (
                                    <div className="form-group">
                                        <label>Paste offer letter / email / message</label>
                                        <textarea rows={8} value={fraudText} onChange={e => setFraudText(e.target.value)} placeholder="Paste the full offer letter, job posting, email, or WhatsApp message here..." style={{ width: '100%', resize: 'vertical', fontFamily: 'inherit', fontSize: '0.85rem', padding: '0.75rem', border: '1.5px solid var(--border-light)', borderRadius: 8, color: 'var(--text-heading)' }} />
                                    </div>
                                ) : (
                                    <>
                                        <div className="form-group"><label>Company Name</label><input type="text" value={fraudCompany} onChange={e => setFraudCompany(e.target.value)} placeholder="e.g. TechSolutions India Pvt Ltd" /></div>
                                        <div className="form-group"><label>Role / Position</label><input type="text" value={fraudRole} onChange={e => setFraudRole(e.target.value)} placeholder="e.g. Software Engineer Intern" /></div>
                                        <div className="form-group"><label>Salary / Stipend Offered</label><input type="text" value={fraudSalary} onChange={e => setFraudSalary(e.target.value)} placeholder="e.g. ₹50,000/month" /></div>
                                        <div className="form-group"><label>Recruiter Email Address</label><input type="email" value={fraudEmail} onChange={e => setFraudEmail(e.target.value)} placeholder="e.g. hr@techsolutions.com" /></div>
                                    </>
                                )}

                                <button className="btn" style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem', background: 'linear-gradient(135deg, #dc2626, #7c3aed)' }} onClick={runFraudCheck} disabled={fraudLoading || (fraudMode === 'paste' ? !fraudText.trim() : !fraudCompany.trim())}>
                                    {fraudLoading ? '⏳ Analyzing with Gemini AI...' : '🛡️ Run Fraud Analysis'}
                                </button>
                            </div>

                            <div>
                                {!fraudResult && !fraudLoading && (
                                    <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
                                        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🛡️</div>
                                        <h3 style={{ marginBottom: '0.5rem' }}>AI Trust Analysis</h3>
                                        <p style={{ color: 'var(--text-main)', fontSize: '0.88rem' }}>Paste or enter offer details and run analysis to get your trust score.</p>
                                    </div>
                                )}
                                {fraudLoading && (
                                    <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                                        <div style={{ fontSize: '2.5rem', marginBottom: '1rem', animation: 'spin360 1s linear infinite', display: 'inline-block' }}>🔍</div>
                                        <p style={{ color: 'var(--text-main)' }}>Analyzing with Gemini AI...</p>
                                    </div>
                                )}
                                {fraudResult && (
                                    <>
                                        <div className="card" style={{ background: verdictBg, border: `2px solid ${scoreColor}40`, textAlign: 'center', padding: '1.5rem', marginBottom: '1rem' }}>
                                            <div style={{ fontSize: '4rem', fontWeight: 900, color: scoreColor, lineHeight: 1 }}>{fraudResult.score}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-main)', margin: '0.25rem 0' }}>Trust Score / 100</div>
                                            <div style={{ height: 10, background: 'var(--border-light)', borderRadius: 5, overflow: 'hidden', margin: '0.75rem 0' }}>
                                                <div style={{ height: '100%', width: `${fraudResult.score}%`, background: `linear-gradient(90deg, #ef4444, ${scoreColor})`, borderRadius: 5, transition: 'width 1s ease' }} />
                                            </div>
                                            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: scoreColor, padding: '0.35rem 1.25rem', background: `${scoreColor}20`, borderRadius: 20, border: `1.5px solid ${scoreColor}40` }}>
                                                {fraudResult.verdict}
                                            </span>
                                        </div>
                                        {fraudResult.flags.length > 0 && (
                                            <div className="card" style={{ background: '#fef2f2', border: '1.5px solid #fecaca', marginBottom: '1rem', padding: '1rem 1.25rem' }}>
                                                <h4 style={{ color: '#b91c1c', marginBottom: '0.65rem', fontSize: '0.9rem' }}>🚩 Red Flags Detected</h4>
                                                <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                                    {fraudResult.flags.map((f, i) => <li key={i} style={{ fontSize: '0.85rem', color: '#7f1d1d' }}>{f}</li>)}
                                                </ul>
                                            </div>
                                        )}
                                        <div className="card" style={{ background: '#f0fdf4', border: '1.5px solid #a7f3d0', padding: '1rem 1.25rem' }}>
                                            <h4 style={{ color: '#065f46', marginBottom: '0.65rem', fontSize: '0.9rem' }}>✅ Verification Tips</h4>
                                            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                                {fraudResult.tips.map((t, i) => <li key={i} style={{ fontSize: '0.85rem', color: '#064e3b' }}>{t}</li>)}
                                            </ul>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </section>
                );
            })()}
            {/* ── NEW FEATURE 1: Interview Intel Vault ── */}
            {activeView === 'intel-vault-page' && (
                <section className="page-view active-view">
                    <div className="section-title">
                        <h2>🔒 "Give-to-Get" Interview Intel Vault</h2>
                        <p>Real interview experiences from students who cracked top companies. You must submit one to read them.</p>
                    </div>
                    
                    {!hasContributedVault ? (
                        <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
                            <h3 style={{ marginBottom: '0.5rem' }}>Vault Locked</h3>
                            <p style={{ color: 'var(--text-main)', marginBottom: '2rem' }}>Contribute your recent interview experience to unlock the vault.</p>
                            <textarea 
                                value={vaultReviewInput} 
                                onChange={(e) => setVaultReviewInput(e.target.value)}
                                placeholder="E.g. I interviewed at Google for SWE Intern. They asked a DP question on Arrays..."
                                style={{ width: '100%', minHeight: '120px', marginBottom: '1rem', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}
                            />
                            <button className="btn" onClick={() => {
                                if (vaultReviewInput.length < 20) return alert('Please enter a valid review.');
                                setHasContributedVault(true);
                                alert('Review submitted! Vault unlocked.');
                            }}>Submit to Unlock</button>
                            
                            <div style={{ marginTop: '3rem', filter: 'blur(8px)', opacity: 0.5, pointerEvents: 'none' }}>
                                <div className="card" style={{ textAlign: 'left', marginBottom: '1rem' }}>
                                    <h4>Google SWE Intern (On-Campus)</h4>
                                    <p>Round 1 was a standard LeetCode medium on Graphs. Round 2 was a System Design question on designing a URL shortener...</p>
                                </div>
                                <div className="card" style={{ textAlign: 'left' }}>
                                    <h4>Atlassian Backend (Off-Campus)</h4>
                                    <p>Heavy focus on Java concurrency and multithreading. Be prepared to write code on a whiteboard without an IDE...</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid-2">
                            <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
                                <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '0.5rem' }}>Google • SWE Intern</div>
                                <h3 style={{ marginBottom: '1rem' }}>Focus heavily on Graphs and DP</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.6 }}>"Round 1 was a standard LeetCode medium on Graphs. Round 2 was a System Design question on designing a URL shortener. They really care about edge cases, so talk out loud while coding."</p>
                            </div>
                            <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
                                <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '0.5rem' }}>Atlassian • Backend</div>
                                <h3 style={{ marginBottom: '1rem' }}>Java Concurrency is key</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.6 }}>"Heavy focus on Java concurrency and multithreading. Be prepared to write code on a whiteboard without an IDE. They also asked about my open source contributions."</p>
                            </div>
                            <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
                                <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '0.5rem' }}>Stripe • Frontend</div>
                                <h3 style={{ marginBottom: '1rem' }}>React internals & Performance</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.6 }}>"They asked me to build a complex UI component from scratch in 45 minutes. Study React hooks deeply, especially useEffect and useMemo. No algorithmic trick questions."</p>
                            </div>
                        </div>
                    )}
                </section>
            )}

            {/* ── NEW FEATURE 2: Reverse-Pitch Drafts ── */}
            {activeView === 'talent-drafts-page' && (
                <section className="page-view active-view">
                    <div className="section-title">
                        <h2>🤝 Reverse-Pitch Talent Drafts</h2>
                        <p>Verified recruiters review your profile and pitch projects directly to you. No applications needed.</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '800px', margin: '0 auto' }}>
                        {draftPitches.map(pitch => (
                            <div key={pitch.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: pitch.status !== 'pending' ? 0.6 : 1 }}>
                                <div>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Incoming Pitch</div>
                                    <h3 style={{ marginBottom: '0.5rem' }}>{pitch.recruiter}</h3>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--success)', fontWeight: 600, marginBottom: '0.5rem' }}>Offers: {pitch.stipend}</div>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>"{pitch.msg}"</p>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '120px' }}>
                                    {pitch.status === 'pending' ? (
                                        <>
                                            <button className="btn" style={{ padding: '0.5rem' }} onClick={() => handlePitchResponse(pitch.id, 'accepted')}>Accept Pitch</button>
                                            <button className="btn btn-outline" style={{ padding: '0.5rem' }} onClick={() => handlePitchResponse(pitch.id, 'declined')}>Decline</button>
                                        </>
                                    ) : (
                                        <div style={{ textAlign: 'center', fontWeight: 600, color: pitch.status === 'accepted' ? 'var(--primary)' : 'var(--text-main)' }}>
                                            {pitch.status === 'accepted' ? 'Accepted ✅' : 'Declined ❌'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* ── NEW FEATURE 3: Micro-Internship Sprints ── */}
            {activeView === 'sprints-page' && (
                <section className="page-view active-view">
                    <div className="section-title">
                        <h2>⚡ Micro-Internship Sprints</h2>
                        <p>Short, 1-3 week hyper-scoped projects with fixed pay. Bid with a 200-word proposal, no resume required.</p>
                    </div>
                    <div className="grid-2">
                        {[
                            { id: 's1', company: 'BuildFast Inc.', title: 'Migrate landing page to Next.js', duration: '2 Weeks', pay: '₹15,000' },
                            { id: 's2', company: 'DataFlow', title: 'Write 3 Python Web Scrapers', duration: '1 Week', pay: '₹8,000' },
                            { id: 's3', company: 'UI Studio', title: 'Design Figma System for App', duration: '3 Weeks', pay: '₹25,000' }
                        ].map(sprint => (
                            <div key={sprint.id} className="card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>{sprint.company}</div>
                                        <h3 style={{ fontSize: '1.1rem' }}>{sprint.title}</h3>
                                    </div>
                                    <div style={{ background: '#ecfdf5', color: '#059669', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                                        {sprint.pay}
                                    </div>
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '1.25rem' }}>⏳ Duration: {sprint.duration}</div>
                                
                                {sprintBids.has(sprint.id) ? (
                                    <button className="btn btn-outline" disabled style={{ width: '100%' }}>Bid Submitted ✅</button>
                                ) : (
                                    <button className="btn" style={{ width: '100%' }} onClick={() => setSprintBidModal(sprint.id)}>Submit 200-Word Bid</button>
                                )}
                            </div>
                        ))}
                    </div>

                    {sprintBidModal && (
                        <div className="modal">
                            <div className="modal-content" style={{ maxWidth: '500px' }}>
                                <span className="close-btn" onClick={() => setSprintBidModal(null)}>×</span>
                                <h3>Submit your Bid</h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '1rem' }}>Skip the resume. Tell them why you can deliver this sprint in 200 words.</p>
                                <textarea 
                                    value={sprintBidText} 
                                    onChange={(e) => setSprintBidText(e.target.value)}
                                    placeholder="I have built 3 Next.js apps before. I can deliver this landing page perfectly responsive in 5 days..."
                                    style={{ width: '100%', minHeight: '150px', marginBottom: '1rem', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}
                                />
                                <button className="btn" style={{ width: '100%' }} onClick={handleSubmitBid}>Send Proposal</button>
                            </div>
                        </div>
                    )}
                </section>
            )}

            {/* ── NEW FEATURE 4: AI Skill Debt Analyzer ── */}
            {activeView === 'skill-debt-page' && (
                <section className="page-view active-view">
                    <div className="section-title">
                        <h2>🤖 AI Skill Debt Analyzer</h2>
                        <p>Paste a Job Description. Gemini will analyze your CV and tell you exactly what skills you are missing.</p>
                    </div>
                    <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <textarea 
                            value={debtJd} 
                            onChange={(e) => setDebtJd(e.target.value)}
                            placeholder="Paste the target Job Description here..."
                            style={{ width: '100%', minHeight: '120px', marginBottom: '1rem', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}
                        />
                        <button className="btn" style={{ width: '100%', marginBottom: '2rem' }} onClick={handleAnalyzeDebt} disabled={debtLoading}>
                            {debtLoading ? 'Analyzing Skill Debt...' : 'Analyze My Profile'}
                        </button>

                        {debtResult && (
                            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <h3 style={{ margin: 0 }}>Match Score: {debtResult.match}%</h3>
                                    <div style={{ width: '60%', background: '#e2e8f0', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                                        <div style={{ width: `${debtResult.match}%`, background: debtResult.match > 70 ? 'var(--success)' : debtResult.match > 40 ? 'var(--accent)' : 'var(--danger)', height: '100%' }}></div>
                                    </div>
                                </div>
                                <h4 style={{ color: 'var(--danger)', marginBottom: '0.75rem' }}>⚠️ Missing Skills (Skill Debt):</h4>
                                <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {debtResult.missing.map((skill, i) => (
                                        <li key={i} style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>{skill}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </section>
            )}


            {/* ── NEW FEATURE 5: AI Mock Interview ── */}
            {activeView === 'mock-interview-page' && (
                <section className="page-view active-view">
                    <div className="section-title">
                        <h2>🎙️ AI Mock Interview & Speech Analysis</h2>
                        <p>Practice speaking out loud. Gemini will analyze your confidence, pacing, filler words, and factual accuracy.</p>
                    </div>

                    {!isInterviewing && interviewStage === 'intro' ? (
                        <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎙️</div>
                            <h3 style={{ marginBottom: '0.5rem' }}>Start Voice Interview</h3>
                            <p style={{ color: 'var(--text-main)', marginBottom: '2rem' }}>Ensure you are in a quiet environment. This interview will test your verbal communication and technical accuracy.</p>
                            <button className="btn" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }} onClick={startInterview}>Start Interview</button>
                        </div>
                    ) : interviewStage === 'evaluating' ? (
                        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                            <div className="typing-indicator" style={{ display: 'inline-flex', marginBottom: '1rem' }}>
                                <div className="typing-dot" style={{ width: 12, height: 12 }}></div>
                                <div className="typing-dot" style={{ width: 12, height: 12 }}></div>
                                <div className="typing-dot" style={{ width: 12, height: 12 }}></div>
                            </div>
                            <h3>Gemini is evaluating your transcript...</h3>
                            <p style={{ color: 'var(--text-main)' }}>Analyzing filler words, WPM pacing, and factual correctness.</p>
                        </div>
                    ) : interviewStage === 'report' && evalResult ? (
                        <div className="card">
                            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.4rem' }}>📊 Post-Interview Report</h3>
                            <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
                                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-light)', textAlign: 'center' }}>
                                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: evalResult.confidence_score > 75 ? 'var(--success)' : 'var(--accent)' }}>{evalResult.confidence_score}%</div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>Confidence & Pacing</div>
                                    <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-main)' }}>Gemini Audio Analysis</div>
                                </div>
                                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-light)', textAlign: 'center' }}>
                                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: evalResult.content_accuracy_score > 75 ? 'var(--success)' : 'var(--danger)' }}>{evalResult.content_accuracy_score}%</div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>Factual Accuracy</div>
                                    <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-main)' }}>Errors detected: {evalResult.wrong_statements_detected.length}</div>
                                </div>
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <h4 style={{ marginBottom: '0.5rem' }}>🗣️ Hesitation Notes</h4>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{evalResult.hesitation_notes}</p>
                            </div>

                            {evalResult.wrong_statements_detected.length > 0 && evalResult.wrong_statements_detected[0] !== 'None' && (
                                <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#fef2f2', borderLeft: '4px solid #ef4444', borderRadius: '4px' }}>
                                    <h4 style={{ color: '#b91c1c', marginBottom: '0.5rem' }}>⚠️ Factual Errors Detected</h4>
                                    <ul style={{ paddingLeft: '1.5rem' }}>
                                        {evalResult.wrong_statements_detected.map((err: string, i: number) => (
                                            <li key={i} style={{ fontSize: '0.9rem', color: '#991b1b' }}>{err}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div>
                                <h4 style={{ marginBottom: '0.5rem' }}>📈 Improvement Plan</h4>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', whiteSpace: 'pre-wrap' }}>{evalResult.improvement_plan}</div>
                            </div>
                            
                            <button className="btn btn-outline" style={{ width: '100%', marginTop: '2rem' }} onClick={() => setInterviewStage('intro')}>Start New Session</button>
                        </div>
                    ) : (
                        <div className="card">
                            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
                                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.25rem' }}>AI INTERVIEWER</div>
                                <div style={{ fontSize: '1.05rem', fontWeight: 600 }}>{currentAiQuestion}</div>
                            </div>

                            <div style={{ position: 'relative', width: '100%', minHeight: '150px', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-light)', padding: '1rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ width: '16px', height: '16px', background: 'var(--danger)', borderRadius: '50%', animation: 'pulse 1s infinite', marginBottom: '0.5rem' }}></div>
                                <p style={{ color: 'var(--text-main)', fontStyle: 'italic', fontWeight: 600 }}>Recording in progress...</p>
                                <p style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem' }}>00:{recordingTimer.toString().padStart(2, '0')}</p>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <button className="btn" style={{ background: '#dc2626', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={stopInterviewAndEvaluate}>
                                    <div style={{ width: '12px', height: '12px', background: 'white', borderRadius: '2px' }}></div>
                                    Stop & Evaluate Answer
                                </button>
                            </div>
                        </div>
                    )}
                </section>
            )}

            {/* ── NEW EXTENSION 1: WASM Coding Challenges ── */}
            {activeView === 'coding-challenges' && (
                <section className="page-view active-view">
                    <div className="section-title">
                        <h2>💻 WASM "Zero-Compute" Coding Challenges</h2>
                        <p>Write Python code in your browser. Execution runs securely in a local Web Worker via Pyodide—costing zero backend compute.</p>
                    </div>
                    <div className="grid-2">
                        <div className="card" style={{ background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>SELECT PROBLEM</label>
                                <select 
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '1rem', outline: 'none' }}
                                    value={activeCodingProblemId}
                                    onChange={(e) => setActiveCodingProblemId(Number(e.target.value))}
                                >
                                    {codingProblemsData.map(p => (
                                        <option key={p.id} value={p.id}>{p.title} - {p.difficulty}</option>
                                    ))}
                                </select>
                            </div>
                            
                            {(() => {
                                const activeProblem = codingProblemsData.find(p => p.id === activeCodingProblemId) || codingProblemsData[0];
                                return (
                                    <>
                                        <h3 style={{ marginBottom: '1rem' }}>{activeProblem.title} <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', borderRadius: '12px', background: activeProblem.difficulty === 'Easy' ? '#dcfce7' : '#fee2e2', color: activeProblem.difficulty === 'Easy' ? '#166534' : '#991b1b', verticalAlign: 'middle', marginLeft: '0.5rem' }}>{activeProblem.difficulty}</span></h3>
                                        <p style={{ color: 'var(--text-main)', marginBottom: '1rem', whiteSpace: 'pre-wrap' }}>{activeProblem.description}</p>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', background: 'rgba(0,0,0,0.03)', padding: '1rem', borderRadius: '8px', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                                            <strong>Example:</strong><br/>{activeProblem.example}
                                        </div>
                                    </>
                                )
                            })()}
                        </div>
                        <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ padding: '0.75rem 1rem', background: '#1e293b', color: 'white', fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                                <span>main.py</span>
                                <button onClick={runPythonCode} disabled={isPyRunning} style={{ background: isPyRunning ? '#475569' : '#10b981', border: 'none', color: 'white', padding: '0.2rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>{isPyRunning ? 'Running...' : '▶ Run Code'}</button>
                            </div>
                            <textarea 
                                value={pythonCode} 
                                onChange={(e) => setPythonCode(e.target.value)}
                                style={{ flex: 1, minHeight: '250px', background: '#0f172a', color: '#e2e8f0', fontFamily: 'monospace', fontSize: '1rem', padding: '1rem', border: 'none', outline: 'none', resize: 'vertical' }}
                                spellCheck={false}
                            />
                            <div style={{ padding: '1rem', background: '#1e293b', borderTop: '1px solid #334155' }}>
                                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase' }}>Terminal Output</div>
                                <pre style={{ margin: 0, color: pythonOutput.includes('Error') ? '#ef4444' : '#10b981', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>{pythonOutput || "Waiting for execution..."}</pre>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ── NEW EXTENSION 2: Peer Resume Roasts ── */}
            {activeView === 'resume-roasts' && (
                <section className="page-view active-view">
                    <div className="section-title">
                        <h2>🔥 Peer-to-Peer Anonymous Resume Roasts</h2>
                        <p>Upload a PDF and let peers click anywhere on it to leave precise, spatial feedback using local pdf.js rendering.</p>
                    </div>
                    <div className="card" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        {!pdfLoaded ? (
                            <button className="btn btn-outline" onClick={() => setPdfLoaded(true)}>Load Sample Resume (PDF.js)</button>
                        ) : (
                            <div style={{ position: 'relative', display: 'inline-block', maxWidth: '100%', border: '1px solid var(--border-light)', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}>
                                <canvas ref={canvasRef} onClick={handleCanvasClick} width={600} height={800} style={{ display: 'block', background: 'var(--bg-card)', cursor: 'crosshair', maxWidth: '100%' }} />
                                
                                {/* Mock PDF text overlay just for visual if pdf.js isn't fully wired */}
                                <div style={{ position: 'absolute', top: '10%', left: '10%', right: '10%', textAlign: 'left', pointerEvents: 'none' }}>
                                    <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>JOHN DOE</h1>
                                    <p style={{ fontWeight: 600 }}>Software Engineer</p>
                                    <hr style={{ margin: '1rem 0' }}/>
                                    <p>• Built scalable microservices using Node.js</p>
                                    <p>• Increased performance by doing some things</p>
                                    <p>• Fixed a lot of bugs in the legacy system</p>
                                </div>

                                {roastComments.map((c, i) => (
                                    <div key={i} style={{ position: 'absolute', left: `${c.x}%`, top: `${c.y}%`, width: '24px', height: '24px', background: '#ef4444', borderRadius: '50%', transform: 'translate(-50%, -50%)', cursor: 'pointer', border: '2px solid white', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }} title={c.text} className="roast-dot"></div>
                                ))}

                                {roastInput && (
                                    <div style={{ position: 'absolute', left: `${roastInput.x}%`, top: `${roastInput.y}%`, background: 'white', padding: '0.5rem', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', transform: 'translate(-50%, 15px)', zIndex: 10, display: 'flex', gap: '0.5rem' }}>
                                        <input type="text" autoFocus value={roastText} onChange={e => setRoastText(e.target.value)} placeholder="Type roast..." style={{ border: '1px solid var(--border-light)', borderRadius: '4px', padding: '0.25rem 0.5rem' }} onKeyDown={e => e.key === 'Enter' && addRoastComment()} />
                                        <button onClick={addRoastComment} style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '4px', padding: '0 0.5rem', cursor: 'pointer' }}>Add</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* ── NEW EXTENSION 3: Spaced Repetition Flashcards ── */}
            {activeView === 'flashcards' && (
                <section className="page-view active-view">
                    <div className="section-title">
                        <h2>🧠 Spaced Repetition Interview Flashcards</h2>
                        <p>Memorize complex CS concepts permanently using the SM-2 algorithm. Your progress is saved entirely locally in your browser!</p>
                    </div>
                    
                    <div className="card" style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center', padding: '3rem 2rem' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1.5rem', textTransform: 'uppercase' }}>Card {currentCardIdx + 1} of {flashcards.length}</div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {flashcards[currentCardIdx].q}
                        </h3>

                        {!showAnswer ? (
                            <button className="btn btn-outline" style={{ width: '100%', padding: '1rem' }} onClick={() => setShowAnswer(true)}>Show Answer</button>
                        ) : (
                            <div style={{ animation: 'fadeIn 0.3s' }}>
                                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', color: 'var(--primary)', fontWeight: 600, minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {flashcards[currentCardIdx].a}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>How well did you know this?</div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button className="btn" style={{ flex: 1, background: '#ef4444', border: 'none' }} onClick={() => sm2Rate(1)}>Forgot</button>
                                    <button className="btn" style={{ flex: 1, background: '#f59e0b', border: 'none' }} onClick={() => sm2Rate(3)}>Hard</button>
                                    <button className="btn" style={{ flex: 1, background: '#3b82f6', border: 'none' }} onClick={() => sm2Rate(4)}>Good</button>
                                    <button className="btn" style={{ flex: 1, background: '#10b981', border: 'none' }} onClick={() => sm2Rate(5)}>Easy</button>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* ── NEW EXTENSION 4: GitHub Portfolio Generator ── */}
            {activeView === 'github-portfolio' && (
                <section className="page-view active-view">
                    <div className="section-title">
                        <h2>🐙 The "No-Resume" GitHub Portfolio</h2>
                        <p>Generate a stunning proof-of-work dashboard instantly using live data from the free GitHub REST API.</p>
                    </div>

                    <div className="card" style={{ maxWidth: '500px', margin: '0 auto 2rem auto', display: 'flex', gap: '1rem' }}>
                        <input type="text" className="search-bar" placeholder="Enter GitHub Username (e.g., torvalds)" value={ghUsername} onChange={e => setGhUsername(e.target.value)} style={{ flex: 1 }} onKeyDown={e => e.key === 'Enter' && fetchGithub()} />
                        <button className="btn" onClick={fetchGithub} disabled={ghLoading}>{ghLoading ? 'Fetching...' : 'Generate'}</button>
                    </div>

                    {ghProfile && (
                        <div style={{ maxWidth: '800px', margin: '0 auto', background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>
                            <div style={{ background: 'var(--bg-card)', padding: '2rem', display: 'flex', alignItems: 'center', gap: '2rem', borderBottom: '1px solid var(--border-light)' }}>
                                <img src={ghProfile.avatar} alt="Avatar" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
                                <div>
                                    <h2 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{ghProfile.name || ghUsername}</h2>
                                    <div style={{ color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: 600 }}>⭐ {ghProfile.totalStars} Total Stars</div>
                                </div>
                            </div>
                            
                            <div className="grid-2" style={{ padding: '2rem' }}>
                                <div>
                                    <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem', color: 'var(--text-main)' }}>Top Tech Stack</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {ghProfile.topLangs.map((lang: any, i: number) => (
                                            <div key={i}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontWeight: 600 }}>
                                                    <span>{lang[0]}</span>
                                                    <span>{lang[1]} repos</span>
                                                </div>
                                                <div style={{ height: '8px', background: 'var(--bg-body)', borderRadius: '4px', overflow: 'hidden' }}>
                                                    <div style={{ height: '100%', width: `${(lang[1]/ghProfile.topLangs[0][1])*100}%`, background: i === 0 ? '#3b82f6' : i === 1 ? '#10b981' : '#f59e0b' }}></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                <div>
                                    <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem', color: 'var(--text-main)' }}>Top Repositories</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {ghProfile.topRepos.map((repo: any, i: number) => (
                                            <div key={i} style={{ padding: '1rem', border: '1px solid var(--border-light)', borderRadius: '8px', background: '#f8fafc' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                                    <a href={repo.html_url} target="_blank" rel="noreferrer" style={{ fontWeight: 800, color: 'var(--primary)', textDecoration: 'none' }}>{repo.name}</a>
                                                    <span style={{ fontSize: '0.8rem', background: 'var(--bg-card)', padding: '0.1rem 0.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', fontWeight: 600 }}>⭐ {repo.stargazers_count}</span>
                                                </div>
                                                <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{repo.description || "No description provided."}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            )}

            {/* ── NEW EXTENSION 5: Campus Stipend Heatmap ── */}
            {activeView === 'campus-heatmap' && (
                <section className="page-view active-view">
                    <div className="section-title">
                        <h2>🗺️ Crowdsourced Stipend & Ghosting Heatmap</h2>
                        <p>Click the map to drop a pin anonymously. See which local startups actually hire and which ones just ghost.</p>
                    </div>
                    
                    <div className="card" style={{ padding: 0, overflow: 'hidden', height: '600px', borderRadius: '16px', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '1rem', left: '50%', transform: 'translateX(-50%)', zIndex: 1000, background: 'white', padding: '0.5rem 1rem', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', display: 'flex', gap: '1rem', fontWeight: 600, fontSize: '0.9rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: 12, height: 12, background: '#10b981', borderRadius: '50%' }}></div> Hired</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: 12, height: 12, background: '#f59e0b', borderRadius: '50%' }}></div> Interviewed</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: 12, height: 12, background: '#ef4444', borderRadius: '50%' }}></div> Ghosted</div>
                        </div>
                        <div ref={initMap} style={{ width: '100%', height: '100%', background: '#e2e8f0' }}></div>
                    </div>
                </section>
            )}

            {/* ── FEATURE 6: SKILLS GAP MODAL ── */}
            {gapJob && (
                <div className="modal" onClick={(e: any) => e.target.className === 'modal' && setGapJob(null)}>
                    <div className="modal-content" style={{ maxWidth: '600px', background: 'var(--bg-body)' }}>
                        <span className="close-btn" onClick={() => setGapJob(null)}>×</span>
                        <h3 style={{ marginBottom: '0.25rem', fontSize: '1.15rem', fontWeight: 800 }}>🎯 Skills Gap Analysis</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '1.25rem' }}>{gapJob.title} at <strong>{gapJob.company}</strong></p>
                        {(() => {
                            const m = calculatePrecisionMatch(candidateCV, gapJob);
                            return (
                                <>
                                    <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
                                        <div className="stat-box" style={{ flex: 1 }}><h4 style={{ fontSize: '1.6rem' }}>{m.matchPercentage}%</h4><p>Overall Match</p></div>
                                        <div className="stat-box" style={{ flex: 1 }}><h4 style={{ fontSize: '1.6rem', color: '#047857' }}>{m.matchedSkills.length}</h4><p>Skills Matched</p></div>
                                        <div className="stat-box" style={{ flex: 1 }}><h4 style={{ fontSize: '1.6rem', color: '#b91c1c' }}>{m.missingSkills.length}</h4><p>Skills Missing</p></div>
                                    </div>
                                    {m.matchedSkills.length > 0 && (
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#047857', marginBottom: '0.75rem' }}>✅ Unlocked Skills (You have these):</div>
                                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                                {m.matchedSkills.map(s => (
                                                    <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                                        <div className="skill-tree-node unlocked">✨</div>
                                                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-heading)' }}>{s}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {m.missingSkills.length > 0 && (
                                        <div>
                                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#b91c1c', marginBottom: '0.75rem' }}>❌ Quest Log: Skills to acquire:</div>
                                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                                {m.missingSkills.map(s => (
                                                    <a key={s} href={`https://www.youtube.com/results?search_query=learn+${encodeURIComponent(s)}+tutorial`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                                            <div className="skill-tree-node">🔒</div>
                                                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--danger)' }}>{s}</span>
                                                        </div>
                                                    </a>
                                                ))}
                                            </div>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-main)', marginTop: '1rem' }}>💡 Click any locked skill node to find free YouTube tutorials and level up!</p>
                                        </div>
                                    )}
                                </>
                            );
                        })()}
                        {/* Tracker removed */}
                    </div>
                </div>
            )}
            
            </div>
        </main>
        </div>
    );
}
