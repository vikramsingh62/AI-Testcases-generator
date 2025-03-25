import ExcelJS from 'exceljs';
import { Requirement, TestCase } from '@shared/schema';

/**
 * Generate an Excel file with requirements and test cases
 */
export async function generateExcel(
  requirements: Requirement[],
  testCases: TestCase[],
  title: string = 'Test Cases'
): Promise<Buffer> {
  // Create a new workbook
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'TestCase Generator';
  workbook.lastModifiedBy = 'TestCase Generator';
  workbook.created = new Date();
  workbook.modified = new Date();
  
  // Add a requirements worksheet
  const requirementsSheet = workbook.addWorksheet('Requirements');
  
  // Set up the columns for the requirements sheet
  requirementsSheet.columns = [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'Requirement', key: 'text', width: 100 }
  ];
  
  // Add the requirements data
  requirementsSheet.addRows(requirements);
  
  // Style the header row
  const headerRow = requirementsSheet.getRow(1);
  headerRow.font = { bold: true };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' }
  };
  headerRow.border = {
    bottom: { style: 'thin' }
  };
  
  // Apply borders to all cells
  requirementsSheet.eachRow((row, rowNumber) => {
    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
  });
  
  // Add a test cases worksheet
  const testCasesSheet = workbook.addWorksheet('Test Cases');
  
  // Set up the columns for the test cases sheet
  testCasesSheet.columns = [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'Description', key: 'description', width: 60 },
    { header: 'Precondition', key: 'precondition', width: 40 },
    { header: 'Type', key: 'type', width: 15 },
    { header: 'Expected Result', key: 'expectedResult', width: 60 },
    { header: 'Priority', key: 'priority', width: 15 },
    { header: 'Requirement', key: 'requirement', width: 10 }
  ];
  
  // Add the test cases data
  testCasesSheet.addRows(testCases);
  
  // Style the header row
  const testHeaderRow = testCasesSheet.getRow(1);
  testHeaderRow.font = { bold: true };
  testHeaderRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' }
  };
  testHeaderRow.border = {
    bottom: { style: 'thin' }
  };
  
  // Apply conditional formatting based on test case type and priority
  testCasesSheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) { // Skip header row
      const typeCell = row.getCell(4); // Type column (index updated for new column order)
      const priorityCell = row.getCell(6); // Priority column
      
      // Type formatting
      if (typeCell.value === 'positive') {
        typeCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFE6F4EA' } // Light green
        };
      } else if (typeCell.value === 'negative') {
        typeCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFCE8E6' } // Light red
        };
      } else if (typeCell.value === 'edge_case') {
        typeCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFF8E1' } // Light yellow
        };
      } else if (typeCell.value === 'performance') {
        typeCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFE8F0FE' } // Light blue
        };
      }
      
      // Priority formatting
      if (priorityCell.value === 'high') {
        priorityCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFCE8E6' } // Light red for high priority
        };
        priorityCell.font = { bold: true };
      } else if (priorityCell.value === 'medium') {
        priorityCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFF8E1' } // Light yellow for medium priority
        };
      } else if (priorityCell.value === 'low') {
        priorityCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFE6F4EA' } // Light green for low priority
        };
      }
    }
    
    // Apply borders to all cells
    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
  });
  
  // We only need the two main sheets - requirements and test cases
  // No additional per-requirement sheets as requested by the user
  
  // Generate the buffer
  return await workbook.xlsx.writeBuffer();
}

/**
 * Generate a CSV file with requirements and test cases
 */
export async function generateCSV(
  requirements: Requirement[],
  testCases: TestCase[]
): Promise<string> {
  // Create CSV headers
  let csv = 'Type,ID,Description,TestType,ExpectedResult,RequirementID\n';
  
  // Add requirements
  requirements.forEach(req => {
    csv += `Requirement,${req.id},"${escapeCSV(req.text)}",,,\n`;
  });
  
  // Add test cases
  testCases.forEach(testCase => {
    csv += `TestCase,${testCase.id},"${escapeCSV(testCase.description)}",${testCase.type},"${escapeCSV(testCase.expectedResult)}",${testCase.requirement}\n`;
  });
  
  return csv;
}

// Helper function to escape CSV values
function escapeCSV(value: string): string {
  return value.replace(/"/g, '""');
}
