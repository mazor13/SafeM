import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

// סגנונות RTL לעברית
const styles = StyleSheet.create({
  page: { 
    padding: 40, 
    fontFamily: 'Helvetica',
    direction: 'rtl'
  },
  header: { 
    marginBottom: 20, 
    borderBottom: 2, 
    borderBottomColor: '#4F46E5', 
    paddingBottom: 15 
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4F46E5',
    marginBottom: 5,
    textAlign: 'right'
  },
  title: { 
    fontSize: 18, 
    marginBottom: 8, 
    color: '#333',
    textAlign: 'right'
  },
  subtitle: { 
    fontSize: 11, 
    color: '#666', 
    marginBottom: 3,
    textAlign: 'right'
  },
  infoRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginTop: 10
  },
  infoBox: {
    backgroundColor: '#F3F4F6',
    padding: 8,
    borderRadius: 4,
    width: '30%'
  },
  infoLabel: {
    fontSize: 9,
    color: '#666',
    textAlign: 'right'
  },
  infoValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'right'
  },
  section: { 
    marginVertical: 12 
  },
  sectionTitle: { 
    fontSize: 14, 
    fontWeight: 'bold',
    marginBottom: 8, 
    backgroundColor: '#4F46E5', 
    color: 'white',
    padding: 8,
    borderRadius: 4,
    textAlign: 'right'
  },
  table: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 4
  },
  tableHeader: {
    flexDirection: 'row-reverse',
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    padding: 8
  },
  tableRow: { 
    flexDirection: 'row-reverse', 
    borderBottomWidth: 1, 
    borderBottomColor: '#E5E7EB', 
    paddingVertical: 8,
    paddingHorizontal: 8,
    alignItems: 'center' 
  },
  colNum: { 
    width: '8%',
    textAlign: 'center'
  },
  colText: { 
    width: '52%',
    paddingRight: 8
  },
  colStatus: { 
    width: '20%',
    textAlign: 'center'
  },
  colImage: { 
    width: '20%',
    alignItems: 'center'
  },
  headerText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#374151',
    textAlign: 'right'
  },
  itemText: {
    fontSize: 10,
    color: '#333',
    textAlign: 'right'
  },
  statusPass: { 
    backgroundColor: '#D1FAE5',
    color: '#065F46',
    padding: 4,
    borderRadius: 4,
    fontSize: 10,
    fontWeight: 'bold'
  },
  statusFail: { 
    backgroundColor: '#FEE2E2',
    color: '#991B1B',
    padding: 4,
    borderRadius: 4,
    fontSize: 10,
    fontWeight: 'bold'
  },
  statusNA: {
    backgroundColor: '#F3F4F6',
    color: '#6B7280',
    padding: 4,
    borderRadius: 4,
    fontSize: 10
  },
  evidenceImage: { 
    width: 50, 
    height: 40, 
    objectFit: 'cover', 
    borderRadius: 4,
    border: 1,
    borderColor: '#E5E7EB'
  },
  noImage: {
    fontSize: 8,
    color: '#9CA3AF'
  },
  footer: { 
    marginTop: 30,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB'
  },
  summaryRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-around',
    marginBottom: 20
  },
  summaryBox: {
    alignItems: 'center',
    padding: 10
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  summaryLabel: {
    fontSize: 10,
    color: '#666'
  },
  signatureBox: { 
    alignItems: 'flex-end',
    marginTop: 20
  },
  signatureImage: { 
    width: 150, 
    height: 60,
    marginBottom: 5
  },
  signatureLine: {
    width: 150,
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 5
  },
  signatureLabel: { 
    fontSize: 10, 
    color: '#666',
    textAlign: 'center'
  },
  pageNumber: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 10,
    color: '#9CA3AF'
  }
});

interface InspectionItem {
  id: string;
  text: string;
  type: string;
  required?: boolean;
}

interface Section {
  id: string;
  title: string;
  items: InspectionItem[];
}

interface PDFProps {
  data: {
    id: string;
    clientName: string;
    siteName?: string;
    templateName: string;
    createdAt?: any;
    completedAt?: any;
    progress: number;
    status: string;
    answers: Record<string, any>;
    templateSnapshot: Section[];
    signatureData?: string;
    inspectorName?: string;
  }
}

export const InspectionPDF = ({ data }: PDFProps) => {
  // חישוב סטטיסטיקות
  let passCount = 0;
  let failCount = 0;
  let totalItems = 0;

  data.templateSnapshot.forEach(section => {
    section.items.forEach(item => {
      if (item.type === 'pass_fail') {
        totalItems++;
        const answer = data.answers?.[item.id];
        if (answer === 'pass') passCount++;
        else if (answer === 'fail') failCount++;
      }
    });
  });

  const formatDate = (date: any) => {
    if (!date) return new Date().toLocaleDateString('he-IL');
    if (date.toDate) return date.toDate().toLocaleDateString('he-IL');
    return new Date(date).toLocaleDateString('he-IL');
  };

  const getStatusDisplay = (answer: any, type: string) => {
    if (type === 'pass_fail') {
      if (answer === 'pass') return { text: 'תקין', style: styles.statusPass };
      if (answer === 'fail') return { text: 'לקוי', style: styles.statusFail };
      return { text: '-', style: styles.statusNA };
    }
    if (type === 'text') return { text: answer || '-', style: styles.statusNA };
    if (type === 'number') return { text: answer || '-', style: styles.statusNA };
    if (type === 'photo') return { text: answer ? 'יש תמונה' : '-', style: styles.statusNA };
    return { text: '-', style: styles.statusNA };
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>SafeM</Text>
          <Text style={styles.title}>{data.templateName}</Text>
          
          <View style={styles.infoRow}>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>לקוח</Text>
              <Text style={styles.infoValue}>{data.clientName}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>אתר</Text>
              <Text style={styles.infoValue}>{data.siteName || '-'}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>תאריך</Text>
              <Text style={styles.infoValue}>{formatDate(data.createdAt)}</Text>
            </View>
          </View>
        </View>

        {/* Sections */}
        {data.templateSnapshot.map((section) => (
          <View key={section.id} style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            
            <View style={styles.table}>
              {/* Table Header */}
              <View style={styles.tableHeader}>
                <Text style={[styles.headerText, styles.colNum]}>#</Text>
                <Text style={[styles.headerText, styles.colText]}>פריט בדיקה</Text>
                <Text style={[styles.headerText, styles.colStatus]}>תוצאה</Text>
                <Text style={[styles.headerText, styles.colImage]}>תמונה</Text>
              </View>
              
              {/* Table Rows */}
              {section.items.map((item, index) => {
                const answer = data.answers?.[item.id];
                const status = getStatusDisplay(answer, item.type);
                const isPhoto = item.type === 'photo' && answer;
                
                return (
                  <View key={item.id} style={styles.tableRow}>
                    <Text style={[styles.itemText, styles.colNum]}>{index + 1}</Text>
                    <Text style={[styles.itemText, styles.colText]}>{item.text}</Text>
                    <View style={styles.colStatus}>
                      <Text style={status.style}>{status.text}</Text>
                    </View>
                    <View style={styles.colImage}>
                      {isPhoto ? (
                        <Image src={answer} style={styles.evidenceImage} />
                      ) : (
                        <Text style={styles.noImage}>-</Text>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        ))}

        {/* Summary */}
        <View style={styles.footer}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryBox}>
              <Text style={[styles.summaryNumber, { color: '#065F46' }]}>{passCount}</Text>
              <Text style={styles.summaryLabel}>תקין</Text>
            </View>
            <View style={styles.summaryBox}>
              <Text style={[styles.summaryNumber, { color: '#991B1B' }]}>{failCount}</Text>
              <Text style={styles.summaryLabel}>לקוי</Text>
            </View>
            <View style={styles.summaryBox}>
              <Text style={[styles.summaryNumber, { color: '#4F46E5' }]}>{data.progress}%</Text>
              <Text style={styles.summaryLabel}>הושלם</Text>
            </View>
          </View>

          {/* Signature */}
          {data.signatureData && (
            <View style={styles.signatureBox}>
              <Image src={data.signatureData} style={styles.signatureImage} />
              <View style={styles.signatureLine}>
                <Text style={styles.signatureLabel}>
                  {data.inspectorName || 'חתימת בודק'}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Page Number */}
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
      </Page>
    </Document>
  );
};

export default InspectionPDF;
