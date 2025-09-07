import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Student, Project, Module } from '../types';

export const exportToExcel = (
  students: Student[],
  projects: Project[],
  modules: Module[],
  filename: string = 'trombinoscope_ege'
) => {
  // Créer un nouveau workbook
  const workbook = XLSX.utils.book_new();

  // Feuille 1: Étudiants
  const studentsData = students.map(student => ({
    'Numéro Étudiant': student.studentNumber,
    'Prénom': student.firstName,
    'Nom': student.lastName,
    'Email': student.email,
  }));

  const studentsSheet = XLSX.utils.json_to_sheet(studentsData);
  XLSX.utils.book_append_sheet(workbook, studentsSheet, 'Étudiants');

  // Feuille 2: Projets
  const projectsData = projects.map(project => {
    const module = modules.find(m => m.id === project.moduleId);
    return {
      'Nom du Projet': project.name,
      'Module': module?.name || 'Module inconnu',
      'Description': project.description || '',
      'Deadline': project.deadline.toLocaleDateString('fr-FR'),
      'Statut': project.status,
      'Date de Rendu': project.submissionDate?.toLocaleDateString('fr-FR') || '',
      'Note': project.grade || '',
      'Commentaires': project.comments || '',
    };
  });

  const projectsSheet = XLSX.utils.json_to_sheet(projectsData);
  XLSX.utils.book_append_sheet(workbook, projectsSheet, 'Projets');

  // Feuille 3: Modules
  const modulesData = modules.map(module => ({
    'Nom du Module': module.name,
    'Description': module.description || '',
    'Couleur': module.color,
  }));

  const modulesSheet = XLSX.utils.json_to_sheet(modulesData);
  XLSX.utils.book_append_sheet(workbook, modulesSheet, 'Modules');

  // Feuille 4: Résumé par étudiant
  const studentSummaryData = students.map(student => {
    const studentProjects = projects.filter(p => p.studentIds.includes(student.id));
    const submittedProjects = studentProjects.filter(p => p.status === 'Remis' || p.status === 'Validé');
    const averageGrade = studentProjects
      .filter(p => p.grade !== undefined)
      .reduce((sum, p) => sum + (p.grade || 0), 0) / studentProjects.filter(p => p.grade !== undefined).length || 0;

    return {
      'Numéro Étudiant': student.studentNumber,
      'Prénom': student.firstName,
      'Nom': student.lastName,
      'Email': student.email,
      'Nombre de Projets': studentProjects.length,
      'Projets Rendus': submittedProjects.length,
      'Taux de Rendu (%)': studentProjects.length > 0 ? Math.round((submittedProjects.length / studentProjects.length) * 100) : 0,
      'Moyenne': averageGrade > 0 ? averageGrade.toFixed(1) : '',
    };
  });

  const summarySheet = XLSX.utils.json_to_sheet(studentSummaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Résumé Étudiants');

  // Sauvegarder le fichier
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

export const exportToPDF = async (
  students: Student[],
  projects: Project[],
  modules: Module[],
  filename: string = 'trombinoscope_ege'
) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPosition = 20;

  // Fonction pour ajouter une nouvelle page si nécessaire
  const checkPageBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - 20) {
      pdf.addPage();
      yPosition = 20;
    }
  };

  // Titre principal
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Trombinoscope EGE - Suivi Étudiant', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // Date de génération
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 20;

  // Section 1: Résumé général
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Résumé Général', 20, yPosition);
  yPosition += 10;

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`• Nombre total d'étudiants: ${students.length}`, 20, yPosition);
  yPosition += 6;
  pdf.text(`• Nombre total de projets: ${projects.length}`, 20, yPosition);
  yPosition += 6;
  pdf.text(`• Nombre de modules: ${modules.length}`, 20, yPosition);
  yPosition += 15;

  // Section 2: Liste des étudiants
  checkPageBreak(50);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Liste des Étudiants', 20, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Numéro', 20, yPosition);
  pdf.text('Nom', 50, yPosition);
  pdf.text('Prénom', 100, yPosition);
  pdf.text('Email', 150, yPosition);
  yPosition += 6;

  pdf.setFont('helvetica', 'normal');
  students.forEach((student, index) => {
    checkPageBreak(10);
    pdf.text(student.studentNumber, 20, yPosition);
    pdf.text(student.lastName, 50, yPosition);
    pdf.text(student.firstName, 100, yPosition);
    pdf.text(student.email, 150, yPosition);
    yPosition += 6;
  });

  yPosition += 10;

  // Section 3: Projets par module
  checkPageBreak(50);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Projets par Module', 20, yPosition);
  yPosition += 10;

  modules.forEach((module) => {
    checkPageBreak(30);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text(module.name, 20, yPosition);
    yPosition += 8;

    const moduleProjects = projects.filter(p => p.moduleId === module.id);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    
    moduleProjects.forEach((project) => {
      checkPageBreak(15);
      pdf.text(`• ${project.name}`, 30, yPosition);
      yPosition += 5;
      pdf.text(`  Deadline: ${project.deadline.toLocaleDateString('fr-FR')}`, 35, yPosition);
      yPosition += 5;
      pdf.text(`  Statut: ${project.status}`, 35, yPosition);
      if (project.grade) {
        yPosition += 5;
        pdf.text(`  Note: ${project.grade}/20`, 35, yPosition);
      }
      yPosition += 8;
    });
    yPosition += 5;
  });

  // Section 4: Statistiques par étudiant
  checkPageBreak(50);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Statistiques par Étudiant', 20, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Étudiant', 20, yPosition);
  pdf.text('Projets', 80, yPosition);
  pdf.text('Rendus', 100, yPosition);
  pdf.text('Moyenne', 120, yPosition);
  yPosition += 6;

  pdf.setFont('helvetica', 'normal');
  students.forEach((student) => {
    checkPageBreak(10);
    const studentProjects = projects.filter(p => p.studentIds.includes(student.id));
    const submittedProjects = studentProjects.filter(p => p.status === 'Remis' || p.status === 'Validé');
    const averageGrade = studentProjects
      .filter(p => p.grade !== undefined)
      .reduce((sum, p) => sum + (p.grade || 0), 0) / studentProjects.filter(p => p.grade !== undefined).length || 0;

    pdf.text(`${student.firstName} ${student.lastName}`, 20, yPosition);
    pdf.text(studentProjects.length.toString(), 80, yPosition);
    pdf.text(submittedProjects.length.toString(), 100, yPosition);
    pdf.text(averageGrade > 0 ? averageGrade.toFixed(1) : '-', 120, yPosition);
    yPosition += 6;
  });

  // Sauvegarder le PDF
  pdf.save(`${filename}.pdf`);
};

export const exportTrombinoscopeToPDF = async (
  students: Student[],
  containerId: string = 'trombinoscope-container',
  filename: string = 'trombinoscope_photos'
) => {
  const element = document.getElementById(containerId);
  if (!element) {
    console.error('Container not found for PDF export');
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    const imgWidth = pageWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    let heightLeft = imgHeight;
    let position = 10;

    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight - 20;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight + 10;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - 20;
    }

    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};
