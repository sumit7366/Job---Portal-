import { Job } from "../models/job.model.js";

// admin post krega job
export const postJob = async (req, res) => {
    try {
        const {
            title,
            description,
            requirements,
            salary,
            location,
            jobType,
            experience, // This is mapped to experienceLevel in DB
            position,
            companyId
        } = req.body;

        const userId = req.id;

        // Check for missing fields
        if (
            !title || !description || !requirements || !salary ||
            !location || !jobType || !experience || !position || !companyId
        ) {
            return res.status(400).json({
                message: "Something is missing.",
                success: false
            });
        }

        // Convert and validate salary
        const salaryNum = Number(salary);
        if (isNaN(salaryNum)) {
            return res.status(400).json({
                message: "Invalid salary value.",
                success: false
            });
        }

        // Optional: Validate experience format (if it's a range like "0-1", keep it string)
        const experienceRegex = /^\d+(-\d+)?$/; // Accepts "0", "0-1", "3-5", etc.
        if (!experienceRegex.test(experience)) {
            return res.status(400).json({
                message: "Invalid experience format. Use formats like '0-1', '2-4', etc.",
                success: false
            });
        }

        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(",").map(req => req.trim()),
            salary: salaryNum,
            location,
            jobType,
            experienceLevel: experience, // assumed to be a string, update schema accordingly
            position,
            company: companyId,
            created_by: userId
        });

        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.error("Error creating job:", error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false,
            error: error.message
        });
    }
};

// student k liye
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        };
        const jobs = await Job.find(query).populate({
            path: "company"
        }).sort({ createdAt: -1 });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
// student
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:"applications"
        });
        if (!job) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.log(error);
    }
}
// admin kitne job create kra hai abhi tk
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId }).populate({
            path:'company',
            createdAt:-1
        });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
