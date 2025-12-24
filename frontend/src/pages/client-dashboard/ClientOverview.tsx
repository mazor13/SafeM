import React from 'react';
import { useClient } from '../../providers/ClientProvider';

export default function ClientOverview() {
  const { client } = useClient();
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">סקירה כללית: {client?.name}</h1>
      <p className="mt-4 text-gray-500">כאן יוצגו נתוני המאקרו, המפה ואנשי הקשר.</p>
    </div>
  );
}
