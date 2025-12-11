"use client"
import { useParams, useRouter } from 'next/navigation'
const page = () => {
    const params = useParams()
    const orgId = params.orgId
    const router = useRouter()
    return router.push(`/organization-details/${orgId}/payment-methods`)
}
export default page