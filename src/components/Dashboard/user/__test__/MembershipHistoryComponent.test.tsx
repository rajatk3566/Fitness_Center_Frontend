import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor ,within } from '@testing-library/react'
import MembershipHistoryComponent from '@components/Dashboard/user/membershipHistory'
import { getMembershipHistory, getMembershipDetails } from '@src/types/api'

// Mock the API functions
vi.mock('@src/types/api', () => ({
  getMembershipHistory: vi.fn(),
  getMembershipDetails: vi.fn(),
}))

describe('MembershipHistoryComponent', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should show loading state initially', () => {
    // Mock API calls to not resolve immediately
    vi.mocked(getMembershipDetails).mockImplementation(() => new Promise(() => {}))
    
    render(<MembershipHistoryComponent />)
    
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  // it('should display error message when API call fails', async () => {
  //   // Mock API call to fail
  //   vi.mocked(getMembershipDetails).mockRejectedValue(new Error('API Error'))
    
  //   render(<MembershipHistoryComponent />)
    
  //   await waitFor(() => {
  //     expect(screen.getByText('API Error')).toBeInTheDocument()
  //   })
  // })
  


  

  it('should display "No renewal history available" when history is empty', async () => {
    // Mock API calls
    vi.mocked(getMembershipDetails).mockResolvedValue([{ member: 2 }])
    vi.mocked(getMembershipHistory).mockResolvedValue([])
    
    render(<MembershipHistoryComponent />)
    
    await waitFor(() => {
      expect(screen.getByText('No renewal history available.')).toBeInTheDocument()
    })
  })

  it('should render membership history correctly', async () => {
    // Mock API calls with sample data
    vi.mocked(getMembershipDetails).mockResolvedValue([{ member: 2 }])
    vi.mocked(getMembershipHistory).mockResolvedValue([
      {
        id: 2,
        member: 2,
        renewed_on: "2025-03-04T11:24:25.977326Z",
        previous_end_date: "2025-05-11",
        new_end_date: "2025-09-08",
        renewal_type: "QUARTERLY",
        amount_paid: "4000.00"
      },
      {
        id: 1,
        member: 2,
        renewed_on: "2025-03-04T10:49:01.413382Z",
        previous_end_date: "2025-04-11",
        new_end_date: "2025-05-11",
        renewal_type: "MONTHLY",
        amount_paid: "1000.00"
      }
    ])
    
    render(<MembershipHistoryComponent />)
    
    await waitFor(() => {
      // Check if the table headers are rendered
      expect(screen.getByText('Date Renewed')).toBeInTheDocument()
      expect(screen.getByText('Previous End Date')).toBeInTheDocument()
      expect(screen.getByText('New End Date')).toBeInTheDocument()
      expect(screen.getByText('Renewal Type')).toBeInTheDocument()
      expect(screen.getByText('Amount Paid')).toBeInTheDocument()
      
      // Check if the data is rendered correctly
      expect(screen.getByText('4 Months')).toBeInTheDocument()
      expect(screen.getByText('1 Month')).toBeInTheDocument()
      expect(screen.getByText('Rs 4000.00')).toBeInTheDocument()
      expect(screen.getByText('Rs 1000.00')).toBeInTheDocument()
    })
  })
})