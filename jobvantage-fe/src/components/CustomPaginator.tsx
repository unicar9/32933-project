import { Box, Button, ButtonGroup } from '@chakra-ui/react';

interface CustomPaginatorProps {
  currentPage: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

export const CustomPaginator: React.FC<CustomPaginatorProps> = ({
  currentPage,
  pageCount,
  onPageChange,
}) => {
  const handleButtonClick = (page: number) => {
    onPageChange(page);
  };

  const buttons = Array.from({ length: pageCount }, (_, i) => i + 1).map(
    (page) => (
      <Button
        key={page}
        onClick={() => handleButtonClick(page)}
        colorScheme={currentPage === page ? 'teal' : 'gray'}
        variant="outline"
      >
        {page}
      </Button>
    )
  );

  return (
    <Box>
      <ButtonGroup size="sm" isAttached>
        {buttons}
      </ButtonGroup>
    </Box>
  );
};
