import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';

// הגדרת סגנונות לדוח
const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica' },
  header: { marginBottom: 20, borderBottom: 1, borderBottomColor: '#ccc', paddingBottom: 10 },
  title: { fontSize: 24, marginBottom: 10, color: '#333' },
  subtitle: { fontSize: 12, color: '#666', marginBottom: 4 },
  
  section: { marginVertical: 10 },
  sectionTitle: { fontSize: 16, marginBottom: 8, backgroundColor: '#f0f0f0', padding: 4 },
  
  row: { flexDirection: 'row', borderBottom: 1, borderBottomColor: '#eee', paddingVertical: 8, alignItems: 'center' },
  colText: { width: '60%' },
  colStatus: { width: '15%' },
  colImage: { width: '25%' },
  
  statusPass: { color: 'green' },
  statusFail: { color: 'red' },
  
  evidenceImage: { width: 80, height: 60, objectFit: 'cover', borderRadius: 4 },
  
  footer: { marginTop: 40, alignItems: 'flex-end' },
  signatureBox: { borderTop: 1, borderTopColor: '#333', paddingTop: 10, alignItems: 'center' },
  signatureImage: { width: 150, height: 60 },
  signatureLabel: { fontSize: 10, color: '#666', marginTop: 4 }
});

// סוגי הנתונים (צריך להתאים למה שיש לנו ב-DB)
interface PDFProps {
  data: {
    clientName: string;
    id: string;
    createdAt: any;
    items: any[];
    signatureData?: string;
    inspectorName?: string;
  }
}

export const InspectionPDF = ({ data }: PDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      
      {/* כותרת הדוח */}
      <View style={styles.header}>
        <Text style={styles.title}>SafeM - Safety Inspection</Text>
        <Text style={styles.subtitle}>Client: {data.clientName}</Text>
        <Text style={styles.subtitle}>ID: {data.id}</Text>
        <Text style={styles.subtitle}>Date: {new Date().toLocaleDateString()}</Text>
      </View>

      {/* רשימת הפריטים */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Inspection Checklist</Text>
        
        {data.items.map((item, index) => (
          <View key={index} style={styles.row}>
            <View style={styles.colText}>
              <Text style={{ fontSize: 12 }}>{item.title}</Text>
              <Text style={{ fontSize: 10, color: '#888' }}>ID: {index + 1}</Text>
            </View>
            
            <View style={styles.colStatus}>
              <Text style={{ 
                fontSize: 12, 
                color: item.status === 'Pass' ? 'green' : item.status === 'Fail' ? 'red' : 'gray' 
              }}>
                {item.status}
              </Text>
            </View>

            <View style={styles.colImage}>
              {item.imageUrl ? (
                <Image src={item.imageUrl} style={styles.evidenceImage} />
              ) : (
                <Text style={{ fontSize: 9, color: '#ccc' }}>No Image</Text>
              )}
            </View>
          </View>
        ))}
      </View>

      {/* חתימה */}
      {data.signatureData && (
        <View style={styles.footer}>
          <View style={styles.signatureBox}>
            <Image src={data.signatureData} style={styles.signatureImage} />
            <Text style={styles.signatureLabel}>Inspector Signature</Text>
          </View>
        </View>
      )}

    </Page>
  </Document>
);
