import React, {useEffect, useState} from 'react';
import {Button, Col, Container, Row} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import {
    deleteGuestIngredient,
    removeGuestIngredient,
    selectGuestIngredient,
} from "../../app/modules/guestRefrigerator";
import styles from "./refrigerator.module.css";
import {IngredientModal} from "../ingredient-modal/ingredient-modal";
import IngredientBox from "../ingredient-box/ingredient-box";
import {Link} from "react-router-dom";
import {
    ChosenIngredients,
    deleteUserIngredient,
    removeUserIngredient,
    selectUserIngredient
} from "../../app/modules/userRefrigerator";
import axios from "axios";

interface IProps {
    user: boolean,
}

const Refrigerator = (props: IProps) => {
    const {user} = props

    const guestIngredients = useSelector(selectGuestIngredient).filter((ingredient) => ingredient.ingredientId !== 0);
    const userIngredients = useSelector(selectUserIngredient).filter((ingredient) => ingredient.ingredientId !== 0);
    const [chosenIngredients, setChosenIngredients] = useState<ChosenIngredients[]>([
        {
            fridgeId: 0,
            ingredientId: 0,
            ingredientImage: "",
            ingredientName: "",
            ingredientTypeName: "",
            userid: 0,
            username: ""
        }
    ]);
    const dispatch = useDispatch();

    const deleteIngredients = async () => {
        await axios.delete("http://localhost:8080/fridge/delete-all",
            {
                data: {
                    userid: sessionStorage.getItem("userId"),
                }
            })
            .catch((err) => {
                console.error(err)
            })
    }

    const removeIngredient = async (id: number) => {
        await axios.delete("http://localhost:8080/fridge/delete", {
            data: {
                userid: sessionStorage.getItem("userId"),
                ingredientid: id,
            }
        })
            .catch((err) => {
                console.error(err)
            })
    }

    const removeIngredientClick = (ingredient: { ingredientId: number, ingredientName: string }) => {
        if (user === true) {
            dispatch(removeUserIngredient(ingredient));
            removeIngredient(ingredient.ingredientId);
        } else {
            dispatch(removeGuestIngredient(ingredient));
        }
    }

    const deleteIngredientClick = () => {
        if (user === true) {
            dispatch(deleteUserIngredient());
            deleteIngredients();
        } else {
            dispatch(deleteGuestIngredient());
        }
    }

    useEffect(() => {
        if (user === true) {
            setChosenIngredients(userIngredients)
        } else {
            setChosenIngredients(guestIngredients)
        }
    }, [chosenIngredients])


    return (
        <Container className={styles.container}>
            <Row>
                <IngredientModal
                    user={user}
                    chosenIngredients={chosenIngredients}
                />
                <Col md={6}>
                    <div className={styles.mobileDesktop}>
                        <p className={styles.title}>
                            ??? ?????????
                        </p>

                        <hr/>

                        {chosenIngredients.length === 0 ?
                            <p className={styles.emptyRefrigerator}>
                                ???????????? ????????????.
                            </p>

                            :

                            <>
                                <div className={styles.deleteBtn}>
                                    {user ?
                                        <Button
                                            className={styles.deleteBtn}
                                            variant="outline-dark"
                                            size="sm"
                                            onClick={() => {
                                                deleteIngredientClick()
                                            }}
                                        >

                                            ????????????

                                        </Button>

                                        :

                                        <Button
                                            className={styles.deleteBtn}
                                            variant="outline-dark"
                                            size="sm"
                                            onClick={() => {
                                                deleteIngredientClick()
                                            }}
                                        >

                                            ????????????

                                        </Button>
                                    }
                                </div>

                                <Row className={styles.refrigeratorBox}>
                                    {chosenIngredients.map((ingredient) => (
                                        <Col
                                            as="p"
                                            xs={3}
                                            className={styles.ingredient}
                                            key={`chosenIngredients-${ingredient.ingredientId}`}
                                            onClick={() => {
                                                removeIngredientClick(ingredient)
                                            }}
                                        >
                                            {ingredient.ingredientName}
                                        </Col>
                                    ))}
                                </Row>
                                {user ?
                                    <div className={styles.recipeBtn}>
                                        <Link to={`/recommend-recipe/${sessionStorage.getItem("userId")}`}>
                                            <Button
                                                variant="outline-dark"
                                                // onClick={() => {findRecommendRecipes()}}
                                            >

                                                ????????? ??????

                                            </Button>
                                        </Link>
                                    </div>
                                    :
                                    <div className={styles.recipeBtn}>
                                        <Link to="/recommend-recipe">
                                            <Button
                                                variant="outline-dark"
                                            >

                                                ????????? ??????

                                            </Button>
                                        </Link>
                                    </div>
                                }
                            </>

                        }
                    </div>
                </Col>


                <Col md={6}>
                    <div className={styles.boxDesktop}>

                        <p className={styles.title}>
                            ??????
                        </p>
                        <hr/>
                        <IngredientBox chosenIngredients={chosenIngredients} user={user}/>
                    </div>
                </Col>


            </Row>
        </Container>
    );
};

export default Refrigerator;