import React from 'react';
import { Row, Col, Card, ListGroup } from 'react-bootstrap';

function SynthesisAnalysis({ result }) {
  if (!result) {
    return <div>No data available for analysis</div>;
  }

  return (
    <div>
      <h3 className="mb-4">Synthesis Analysis</h3>
      
      <Row>
        <Col md={6}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>GC Content</Card.Title>
              <h3>{result.gc_content.toFixed(1)}%</h3>
              <Card.Text className="text-muted">
                Recommended: 25-65%
              </Card.Text>
              {(result.gc_content < 25 || result.gc_content > 65) && (
                <div className="alert alert-warning mt-2">
                  GC content is outside the recommended range
                </div>
              )}
            </Card.Body>
          </Card>
          
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>GC Variation</Card.Title>
              <h3>{result.gc_variation.toFixed(1)}%</h3>
              <Card.Text className="text-muted">
                Recommended: &lt;52%
              </Card.Text>
              {result.gc_variation > 52 && (
                <div className="alert alert-warning mt-2">
                  GC variation exceeds recommended maximum
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Homopolymers</Card.Title>
              <h3>{result.homopolymers_count}</h3>
              <Card.Text className="text-muted">
                Runs of 5+ identical bases found
              </Card.Text>
            </Card.Body>
          </Card>
          
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Repeats</Card.Title>
              <h3>{result.repeats_count}</h3>
              <Card.Text className="text-muted">
                Repeats of 20+ bp found
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Card>
        <Card.Header>
          <h5 className="mb-0">Synthesis Issues</h5>
        </Card.Header>
        <ListGroup variant="flush">
          {result.issues && result.issues.length > 0 ? (
            result.issues.map((issue, index) => (
              <ListGroup.Item key={index} className="text-danger">
                {issue}
              </ListGroup.Item>
            ))
          ) : (
            <ListGroup.Item className="text-success">
              No issues detected. This sequence meets Twist Biosciences synthesis guidelines.
            </ListGroup.Item>
          )}
        </ListGroup>
      </Card>
    </div>
  );
}

export default SynthesisAnalysis;