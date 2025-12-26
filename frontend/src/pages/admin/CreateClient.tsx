import { morningService } from "../../utils/morningService";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { RESERVED_SLUGS } from '../../../../shared/constants/reservedSlugs';
import { TenantStatus } from '../../../../shared/types/tenancy';

export default function CreateClient() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    taxId: '',
    planId: 'starter' as 'starter' | 'pro' | 'enterprise'
  });

  const validateSlug = (slug: string) => {
    if (RESERVED_SLUGS.includes(slug.toLowerCase())) return "כתובת זו שמורה למערכת";
    if (!/^[a-z0-9-]+$/.test(slug)) return "הכתובת יכולה להכיל אותיות קטנות, מספרים ומקפים בלבד";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const slugError = validateSlug(formData.slug);
    if (slugError) return alert(slugError);

    setLoading(true);
    try {
      // בדיקה אם הסלאג כבר תפוס ב-DB
      const q = query(collection(firestore, 'tenants'), where('slug', '==', formData.slug.toLowerCase()));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        alert("הסלאג כבר תפוס על ידי לקוח אחר");
        setLoading(false);
        return;
      }

      // 1. יצירת Tenant
      const tenantRef = await addDoc(collection(firestore, 'tenants'), {
        name: formData.name,
        slug: formData.slug.toLowerCase(),
        taxId: formData.taxId,
        status: 'active' as TenantStatus,
        createdAt: serverTimestamp()
      });

      // 2. יצירת Subscription (מכסות לפי חבילה)
      const quotas = {
        starter: { maxUsers: 5, maxStorageGB: 1, laser: true, fire: false },
        pro: { maxUsers: 20, maxStorageGB: 10, laser: true, fire: true },
        enterprise: { maxUsers: 100, maxStorageGB: 100, laser: true, fire: true }
      };

      await addDoc(collection(firestore, 'subscriptions'), {
        tenantId: tenantRef.id,
        planId: formData.planId,
        ...quotas[formData.planId],
        updatedAt: serverTimestamp()
      });

      // סנכרון עם Morning
      await morningService.createClient({ name: formData.name, email: "", taxId: formData.taxId });
      alert("הלקוח הוקם בהצלחה!");
      navigate('/admin/clients');
    } catch (error) {
      console.error("Error creating client:", error);
      alert("שגיאה בהקמת הלקוח");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white shadow-xl rounded-2xl mt-10 text-right" dir="rtl">
      <h1 className="text-2xl font-bold mb-6 text-indigo-700">הקמת לקוח חדש במערכת AEGIS</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold mb-1">שם החברה</label>
          <input required className="w-full border p-2 rounded" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">ח"פ / מספר עוסק</label>
          <input required className="w-full border p-2 rounded" value={formData.taxId} onChange={e => setFormData({...formData, taxId: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">כתובת גישה (Slug)</label>
          <div className="flex items-center gap-2">
            <input required placeholder="my-company" className="w-full border p-2 rounded text-left" dir="ltr" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} />
            <span className="text-gray-400">.aegis.com</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">בחירת חבילת שירות</label>
          <select className="w-full border p-2 rounded" value={formData.planId} onChange={e => setFormData({...formData, planId: e.target.value as any})}>
            <option value="starter">Starter (5 משתמשים)</option>
            <option value="pro">Pro (20 משתמשים)</option>
            <option value="enterprise">Enterprise (100+ משתמשים)</option>
          </select>
        </div>
        <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors">
          {loading ? 'מקים לקוח...' : 'צור לקוח והפעל מנוע Provisioning'}
        </button>
      </form>
    </div>
  );
}
