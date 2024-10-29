import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { BsEmojiAngry, BsEmojiFrown, BsEmojiExpressionless, BsEmojiSmile, BsEmojiLaughing } from "react-icons/bs";
import Table from 'react-bootstrap/Table';

function FeedbackForm() {
  let [user, setUser] = useState({
    fname: '', lname: '', email: '', phn: '', source: '', hobby: [], rate: '', feedback: ''
  });

  let [list, setList] = useState([]);
  let [editIndex, setEditIndex] = useState(null);
  let [errors, setErrors] = useState({});

  useEffect(() => {
    let oldData = JSON.parse(localStorage.getItem('user')) || [];
    setList(Array.isArray(oldData) ? oldData : []);
    // return (() => {
    //   localStorage.clear()
    // })
  }, []);


  let handleInput = (e) => {
    let { name, value, type, checked } = e.target;

    if (type === 'checkbox') {              // Handle checkbox
      let newHobbies = [...user.hobby];
      if (checked) {
        newHobbies.push(value);
      } else {
        newHobbies = newHobbies.filter(hobby => hobby !== value);
      }
      setUser({ ...user, hobby: newHobbies });
    } else {
      setUser({ ...user, [name]: value });    // Handle text inputs
    }
  };

  // Handle Rating Selection
  let handleRating = (rating, type) => {
    setUser({ ...user, [type]: rating });
  };

  let validateForm = () => {
    let tempErrors = {};
    if (!user.fname) tempErrors.fname = "First Name is required";
    if (!user.lname) tempErrors.lname = "Last Name is required";

    if (!user.email) tempErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(user.email)) tempErrors.email = "Email is invalid";

    if (!user.hobby.length) tempErrors.hobby = "At least one hobby must be selected.";

    if (!user.phn) tempErrors.phn = "Phone no. is required";
    else if (user.phn && !/^\d+$/.test(user.phn)) { tempErrors.phn = "Phone number must contain only digits."; }

    if (!user.feedback) tempErrors.feedback = "Feedback is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  }

  let handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (editIndex !== null) {
      let updatedList = list.map((item, index) =>
        index === editIndex ? user : item
      );
      setList(updatedList);
      localStorage.setItem('user', JSON.stringify(updatedList));
      setEditIndex(null);
    } else {
      let newList = [...list, user];
      setList(newList);
      localStorage.setItem('user', JSON.stringify(newList));
    }
    setUser({ fname: '', lname: '', email: '', phn: '', source: '', hobby: [], rate: '', feedback: '' });  // Reset form
  };

  let deleteData = (pos) => {
    list.splice(pos, 1);
    let newList = [...list];
    setList(newList);
    localStorage.setItem('user', JSON.stringify(newList));
  };

  let editData = (index) => {
    setUser(list[index]);
    setEditIndex(index);
  };

  return (
    <>
      <Container className="">
        <h1 className="text-center">User Registration Feedback</h1>
        <p className='mb-3 text-center'>We would love to hear your thoughts about your registration experience</p>
        <Row className="justify-content-center">
          <Col md={5}>
            <Form className="p-4 border border-info rounded" method='post' onSubmit={handleSubmit}>
              <Row className="mb-3">
                <Col>
                  <Form.Group>
                    <Form.Label>First Name</Form.Label>
                    <Form.Control type="text" name='fname' value={user.fname} onChange={handleInput} placeholder="Enter First Name" />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control type="text" name='lname' value={user.lname} onChange={handleInput} placeholder="Enter Last Name" />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" name='email' value={user.email} onChange={handleInput} placeholder="Enter email" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control type="number" name='phn' value={user.phn} onChange={handleInput} placeholder="Phone Number" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="text-start">How Did You Hear About Us?</Form.Label>
                <Form.Select name='source' value={user.source} onChange={handleInput}>
                  <option>Select an Option</option>
                  <option value="google">Google</option>
                  <option value="insta">Instagram</option>
                  <option value="other">Others</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Hobbies</Form.Label>
                <Row className="mb-3">
                  <Col><Form.Check type="checkbox" name='hobby' value='Learning' checked={user.hobby.includes('Learning')} onChange={handleInput} label="Learning" /></Col>
                  <Col><Form.Check type="checkbox" name='hobby' value='Writing' checked={user.hobby.includes('Writing')} onChange={handleInput} label="Writing" /></Col>
                  <Col><Form.Check type="checkbox" name='hobby' value='Sports' checked={user.hobby.includes('Sports')} onChange={handleInput} label="Sports" /></Col>
                  <Col><Form.Check type="checkbox" name='hobby' value='Yoga' checked={user.hobby.includes('Yoga')} onChange={handleInput} label="Yoga" /></Col>
                </Row>
              </Form.Group>

              <div className='rate'>
                <h5>Rate Your Experience</h5>
                <div className="registration mb-3">
                  <Form.Label>Registration Process</Form.Label><br />
                  <Form.Text>How would you rate your experience with the registration process?</Form.Text><br /><br />
                  <BsEmojiAngry className={`mx-2 fs-3 ${user.rateRegistration === '1' ? 'bg-danger text-dark rounded-circle' : ''}`} onClick={() => handleRating('1', 'rateRegistration')} />
                  <BsEmojiFrown className={`mx-2 fs-3 ${user.rateRegistration === '2' ? 'bg-warning text-dark rounded-circle' : ''}`} onClick={() => handleRating('2', 'rateRegistration')} />
                  <BsEmojiExpressionless className={`mx-2 fs-3 ${user.rateRegistration === '3' ? 'bg-secondary text-dark rounded-circle' : ''}`} onClick={() => handleRating('3', 'rateRegistration')} />
                  <BsEmojiSmile className={`mx-2 fs-3 ${user.rateRegistration === '4' ? 'bg-success text-dark rounded-circle' : ''}`} onClick={() => handleRating('4', 'rateRegistration')} />
                  <BsEmojiLaughing className={`mx-2 fs-3 ${user.rateRegistration === '5' ? 'bg-primary text-dark rounded-circle' : ''}`} onClick={() => handleRating('5', 'rateRegistration')} />
                </div>
                <div className="website mb-3">
                  <Form.Label className='start'>Website Navigation</Form.Label><br />
                  <Form.Text >How was your experience navigating the website?</Form.Text><br /><br />
                  <BsEmojiAngry className={`mx-2 fs-3 ${user.rateWebsite === '1' ? 'bg-danger text-dark rounded-circle' : ''}`} onClick={() => handleRating('1', 'rateWebsite')} />
                  <BsEmojiFrown className={`mx-2 fs-3 ${user.rateWebsite === '2' ? 'bg-warning text-dark rounded-circle' : ''}`} onClick={() => handleRating('2', 'rateWebsite')} />
                  <BsEmojiExpressionless className={`mx-2 fs-3 ${user.rateWebsite === '3' ? 'bg-secondary text-dark rounded-circle' : ''}`} onClick={() => handleRating('3', 'rateWebsite')} />
                  <BsEmojiSmile className={`mx-2 fs-3 ${user.rateWebsite === '4' ? 'bg-success text-dark rounded-circle' : ''}`} onClick={() => handleRating('4', 'rateWebsite')} />
                  <BsEmojiLaughing className={`mx-2 fs-3 ${user.rateWebsite === '5' ? 'bg-primary text-dark rounded-circle' : ''}`} onClick={() => handleRating('5', 'rateWebsite')} />
                </div>
              </div>
              <Form.Label>Feedback</Form.Label>
              <FloatingLabel className='mb-3'>
                <Form.Control as="textarea" name='feedback' value={user.feedback} onChange={handleInput} style={{ height: '100px' }} />
              </FloatingLabel>
              <Button variant="primary" type="submit" className="w-50">{editIndex !== null ? 'Update' : 'Submit'}</Button>
            </Form>
          </Col>
        </Row>

        <Table striped bordered hover responsive className='mt-3' align='center'>
          <thead className="text-center">
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Sources</th>
              <th>Hobbies</th>
              <th>Rate (Registration)</th>
              <th>Rate (Website)</th>
              <th>Feedback</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {list.map((v, i) => (
              <tr key={i}>
                <td>{v.fname}</td>
                <td>{v.lname}</td>
                <td>{v.email}</td>
                <td>{v.phn}</td>
                <td>{v.source}</td>
                <td>{(v.hobby || []).join(', ')}</td>
                <td>{v.rateRegistration}</td>
                <td>{v.rateWebsite}</td>
                <td>{v.feedback}</td>
                <td>
                  <button className='mx-1' onClick={() => deleteData(i)}>Delete</button>
                  <button onClick={() => editData(i)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </>
  );
}

export default FeedbackForm;