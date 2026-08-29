"use client";
import React, { useState, useEffect, useMemo, useRef } from 'react';

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
    const [activeView, setActiveView] = useState<'jobs-page' | 'ai-page' | 'profile-page' | 'portals-page' | 'alumni-page' | 'rejection-page'>('jobs-page');

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
        setAuthUser({
            name: handle.charAt(0).toUpperCase() + handle.slice(1),
            handle: handle,
            uniqueId: `${handle}@smartsquad.com`
        });
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

        setAuthUser({
            name: name,
            handle: handle,
            uniqueId: `${handle}@smartsquad.com`
        });
        setCandidateCV(prev => ({
            ...prev,
            branch: branch,
            branchName: branchName
        }));
        setIsLoggedIn(true);
        setActiveView('profile-page');
    };

    const handleLogout = () => {
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
            const res = await fetch('/api/ai-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: trimmed, history: historyForAPI })
            });
            if (!res.ok) throw new Error('Network error');
            const data = await res.json();
            setChatMessages(prev => [...prev, { role: 'model', text: data.reply }]);
        } catch {
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

        alert("CV & Branch profile successfully updated! Precision scoring recalibrated over 1,008 active listings.");
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
    return (
        <div id="app-dashboard">
            {/* Systematic Navigation Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-brand">
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
                    <div className="user-status-row">
                        <span style={{ color: 'var(--success)', fontWeight: 600 }}>● Active Profile</span>
                        <a style={{ cursor: 'pointer', color: 'var(--accent)', fontWeight: 600 }} onClick={() => setActiveView('profile-page')}>Edit CV</a>
                    </div>
                </div>

                <div className="sidebar-nav-title">Platform Features</div>
                <ul className="sidebar-menu">
                    <li>
                        <a className={`nav-tab ${activeView === 'jobs-page' ? 'active' : ''}`} onClick={() => setActiveView('jobs-page')}>
                            💼 1000+ Opportunities
                        </a>
                    </li>
                    <li>
                        <a className={`nav-tab ${activeView === 'ai-page' ? 'active' : ''}`} onClick={() => setActiveView('ai-page')}>
                            ✨ AI Match Engine
                        </a>
                    </li>
                    <li>
                        <a className={`nav-tab ${activeView === 'profile-page' ? 'active' : ''}`} onClick={() => setActiveView('profile-page')}>
                            📋 Engineering & CV Data
                        </a>
                    </li>
                    <li>
                        <a className={`nav-tab ${activeView === 'portals-page' ? 'active' : ''}`} onClick={() => setActiveView('portals-page')}>
                            🌐 30+ Connected Portals
                        </a>
                    </li>
                    <li>
                        <a className={`nav-tab ${activeView === 'alumni-page' ? 'active' : ''}`} onClick={() => setActiveView('alumni-page')}>
                            🤝 Alumni Mentorship
                        </a>
                    </li>
                    <li>
                        <a className={`nav-tab ${activeView === 'rejection-page' ? 'active' : ''}`} onClick={() => setActiveView('rejection-page')}>
                            📊 Rejection Analytics
                        </a>
                    </li>
                </ul>

                <div className="sidebar-nav-title" style={{ marginTop: '0.85rem' }}>Branch Quick Filters (All 12)</div>
                <ul className="sidebar-menu">
                    <li><a onClick={() => filterByBranchDirect('ai-ds')}><span style={{ color: '#a855f7' }}>●</span> AI & Data Science</a></li>
                    <li><a onClick={() => filterByBranchDirect('cse')}><span style={{ color: '#3b82f6' }}>●</span> Computer Science / IT</a></li>
                    <li><a onClick={() => filterByBranchDirect('ece')}><span style={{ color: '#10b981' }}>●</span> ECE & VLSI</a></li>
                    <li><a onClick={() => filterByBranchDirect('eee')}><span style={{ color: '#06b6d4' }}>●</span> Electrical (EEE)</a></li>
                    <li><a onClick={() => filterByBranchDirect('mech')}><span style={{ color: '#f59e0b' }}>●</span> Mechanical & Auto</a></li>
                    <li><a onClick={() => filterByBranchDirect('civil')}><span style={{ color: '#ef4444' }}>●</span> Civil & Structures</a></li>
                    <li><a onClick={() => filterByBranchDirect('robotics')}><span style={{ color: '#ec4899' }}>●</span> Robotics & Mechatronics</a></li>
                    <li><a onClick={() => filterByBranchDirect('aero')}><span style={{ color: '#6366f1' }}>●</span> Aerospace & Avionics</a></li>
                    <li><a onClick={() => filterByBranchDirect('chem')}><span style={{ color: '#14b8a6' }}>●</span> Chemical Engineering</a></li>
                    <li><a onClick={() => filterByBranchDirect('biotech')}><span style={{ color: '#84cc16' }}>●</span> Biotechnology</a></li>
                    <li><a onClick={() => filterByBranchDirect('metallurgy')}><span style={{ color: '#8b5cf6' }}>●</span> Metallurgy & Materials</a></li>
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
                    <h1>{titlesMap[activeView]}</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span className="badge pass" style={{ fontSize: '0.8rem' }}>
                            Branch: {candidateCV.branchName.split(" ")[0]}
                        </span>
                        <span className="user-id-badge" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                            {authUser.uniqueId}
                        </span>
                    </div>
                </header>

                <div className="content-container">
                    {/* MODULE 1: 1000+ LIVE CHOICES */}
                    {activeView === 'jobs-page' && (
                        <section className="page-view active-view">
                            <div className="section-title">
                                <h2>Live Integrated Feed (1,008+ Options Available)</h2>
                                <p>Ingested across top hiring platforms with real search and application endpoints customized for all 12 engineering disciplines.</p>
                            </div>

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
                                        return (
                                            <div key={item.id} className="card">
                                                <div>
                                                    <h3 style={{ fontSize: '1.05rem' }}>
                                                        <span>{item.title}</span>
                                                        <span className={`badge ${badgeClass}`}>{matchData.matchPercentage}% Fit</span>
                                                    </h3>
                                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                                                        <strong style={{ color: 'var(--text-heading)' }}>{item.company}</strong> • {item.location}
                                                        &nbsp;<span className={`badge ${typeBadgeClass}`} style={{ fontSize: '0.7rem' }}>{typeEmoji} {item.type}</span>
                                                        &nbsp;<span className="badge" style={{ background: '#e0f2fe', color: 'var(--accent)' }}>{item.sourcePortal}</span>
                                                        {item.alumCount > 0 && (
                                                            <span className="badge alum" style={{ marginLeft: '0.4rem', fontSize: '0.7rem' }}>
                                                                🔥 {item.alumCount} Alumni here
                                                            </span>
                                                        )}
                                                    </p>
                                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                                                        <strong>Branch:</strong> <span className="badge">{item.branchTitle}</span>
                                                    </p>
                                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-heading)', marginBottom: '0.5rem', lineHeight: 1.4 }}>
                                                        {item.description}
                                                    </p>
                                                    <p style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                                                        <strong>Comp:</strong> ₹{item.stipend.toLocaleString('en-IN')}/mo • <strong>Min CGPA:</strong> {item.minCGPA}
                                                    </p>

                                                    <div style={{ margin: '0.5rem 0' }}>
                                                        <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>CV Match Analysis:</span>
                                                        <div className="tag-list">
                                                            {matchData.matchedSkills.map(s => (
                                                                <span key={s} className="tag" style={{ background: '#dcfce7', color: '#047857', borderColor: '#a7f3d0' }}>
                                                                    ✓ {s}
                                                                </span>
                                                            ))}
                                                            {matchData.missingSkills.map(s => (
                                                                <span key={s} className="tag" style={{ background: '#fee2e2', color: '#b91c1c', borderColor: '#fecaca' }}>
                                                                    ✕ {s}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="btn-group">
                                                    {item.alumCount > 0 ? (
                                                        <button 
                                                            className="btn btn-outline" 
                                                            style={{ color: 'var(--primary-dark)', borderColor: '#c7d2fe', background: '#e0e7ff' }}
                                                            onClick={() => setReferralModalTarget({ company: item.company })}
                                                        >
                                                            Request Referral
                                                        </button>
                                                    ) : (
                                                        <button className="btn btn-outline" onClick={() => setDetailsModalJob(item)}>
                                                            Inspect Score
                                                        </button>
                                                    )}
                                                    <a href={item.applyUrl} target="_blank" rel="noopener noreferrer" className="btn">
                                                        Apply ↗
                                                    </a>
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
                                        
                                        <div className="item-row" style={{ flexDirection: 'column', alignItems: 'stretch', border: '1.5px solid var(--border-light)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.25rem', background: '#fafaf9' }}>
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

                                        <div className="item-row" style={{ flexDirection: 'column', alignItems: 'stretch', border: '1.5px solid var(--border-light)', borderRadius: '12px', padding: '1.25rem', background: '#fafaf9' }}>
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
                </div>
            </main>

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
                                                        <span key={s} className="tag" style={{ background: '#fee2e2', color: '#b91c1c', borderColor: '#fecaca' }}>
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
                        
                        <div style={{ background: '#f8fafc', border: '1.5px solid var(--border-light)', padding: '1.25rem', borderRadius: '10px', marginBottom: '1.25rem' }}>
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
        </div>
    );
}
