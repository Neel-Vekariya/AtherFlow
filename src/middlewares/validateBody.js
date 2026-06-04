

export function validateBody(schema){
    return (req, res, next) => {
        try {
            const validatedData = schema.safeParse(req.body);
            if (!validatedData.success) {
                return res.status(400).json({
                    error: "Validation failed",
                    details: validatedData.error.flatten(),
                });
            }
            req.body = validatedData.data;
            next();
        } catch (error) {               
            console.error("Error during validation:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }   
}
