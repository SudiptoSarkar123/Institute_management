module.exports = function checkAdmin(req,res,next){
    try {
        if(req.user && req.user.role === 'ADMIN'){
            next()
        }else{
            return res.status(403).json({
                message:"Access denied. Admins only."
            })
        }
    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
    }
}